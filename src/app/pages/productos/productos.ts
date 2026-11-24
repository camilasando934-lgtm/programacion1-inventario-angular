
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type CategoriaProducto = 'Computadoras' | 'Periféricos' | 'Accesorios';

export interface Producto {
  id: number;
  nombre: string;
  categoria: CategoriaProducto;
  precio: number;
  stock: number;
}

@Component({
  selector: 'app-productos',
  imports: [FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  readonly categoriasValidas: CategoriaProducto[] = [
    'Computadoras',
    'Periféricos',
    'Accesorios',
  ];

  productos: Producto[] = [
    { id: 1, nombre: 'Mouse inalámbrico', categoria: 'Periféricos', precio: 15, stock: 8 },
    { id: 2, nombre: 'Teclado mecánico', categoria: 'Periféricos', precio: 45, stock: 3 },
    { id: 3, nombre: 'Laptop 14" i5', categoria: 'Computadoras', precio: 620, stock: 6 },
    { id: 4, nombre: 'Cable HDMI 2m', categoria: 'Accesorios', precio: 8, stock: 20 },
    { id: 5, nombre: 'Monitor 24" IPS', categoria: 'Computadoras', precio: 185, stock: 4 },
    { id: 6, nombre: 'Hub USB-C 4 puertos', categoria: 'Accesorios', precio: 22, stock: 0 },
    { id: 7, nombre: 'Webcam Full HD', categoria: 'Periféricos', precio: 35, stock: 7 },
    { id: 8, nombre: 'Base refrigerante', categoria: 'Accesorios', precio: 19, stock: 2 },
    { id: 9, nombre: 'PC de escritorio Ryzen 5', categoria: 'Computadoras', precio: 540, stock: 5 },
    { id: 10, nombre: 'Alfombrilla XL', categoria: 'Accesorios', precio: 12, stock: 15 },
    { id: 11, nombre: 'Audífonos con micrófono', categoria: 'Periféricos', precio: 30, stock: 0 },
    { id: 12, nombre: 'Mini PC oficina', categoria: 'Computadoras', precio: 390, stock: 4 },
    { id: 13, nombre: 'Adaptador VGA a HDMI', categoria: 'Accesorios', precio: 10, stock: 12 },
    { id: 14, nombre: 'Lector de tarjetas SD', categoria: 'Accesorios', precio: 9, stock: 1 },
    { id: 15, nombre: 'Micrófono de escritorio', categoria: 'Periféricos', precio: 40, stock: 9 },
  ];

  filtroTexto = '';
  filtroCategoria = 'Todas';
  idBuscado: number | null = null;
  resultadoBusquedaId: Producto | null = null;
  mensajeBusquedaId = '';

  editandoId: number | null = null;
  mensajeError = '';
  mensajeEstado = '';

  formulario: Producto = this.crearFormularioVacio();

  private crearFormularioVacio(): Producto {
    return {
      id: this.obtenerSiguienteId(),
      nombre: '',
      categoria: 'Periféricos',
      precio: 1,
      stock: 0,
    };
  }

  private obtenerSiguienteId(): number {
    if (this.productos.length === 0) return 1;
    return Math.max(...this.productos.map((p) => p.id)) + 1;
  }

  // Estadísticas obligatorias (Actividad 5)
  get totalProductos(): number {
    return this.productos.length;
  }

  get unidadesEnExistencia(): number {
    return this.productos.reduce((acc, p) => acc + p.stock, 0);
  }

  get valorInventario(): number {
    return this.productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
  }

  get precioMaximo(): number {
    if (this.productos.length === 0) return 0;
    return Math.max(...this.productos.map((p) => p.precio));
  }

  get cantidadStockBajo(): number {
    return this.productos.filter((p) => p.stock > 0 && p.stock < 5).length;
  }

  get productosFiltrados(): Producto[] {
    const texto = this.filtroTexto.trim().toLowerCase();
    return this.productos.filter((p) => {
      const coincideCategoria =
        this.filtroCategoria === 'Todas' || p.categoria === this.filtroCategoria;
      const coincideTexto =
        !texto ||
        p.nombre.toLowerCase().includes(texto) ||
        p.categoria.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });
  }

  resumenRapido(): void {
    this.mensajeEstado = `Resumen: ${this.totalProductos} productos, ${this.unidadesEnExistencia} unidades en stock y valor total de $${this.valorInventario.toFixed(2)}.`;
  }

  private validarProducto(datos: Producto, esEdicion: boolean): string {
    if (!Number.isInteger(datos.id) || datos.id <= 0) {
      return 'El ID debe ser un número entero positivo.';
    }
    const idDuplicado = this.productos.some(
      (p) => p.id === datos.id && (!esEdicion || p.id !== this.editandoId)
    );
    if (idDuplicado) {
      return `Ya existe un producto con el ID ${datos.id}. El ID debe ser único.`;
    }
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      return 'El nombre del producto no puede estar vacío.';
    }
    if (!this.categoriasValidas.includes(datos.categoria)) {
      return 'La categoría debe ser Computadoras, Periféricos o Accesorios.';
    }
    if (typeof datos.precio !== 'number' || Number.isNaN(datos.precio) || datos.precio <= 0) {
      return 'El precio debe ser mayor que 0.';
    }
    if (
      typeof datos.stock !== 'number' ||
      Number.isNaN(datos.stock) ||
      !Number.isInteger(datos.stock) ||
      datos.stock < 0
    ) {
      return 'El stock debe ser un número entero mayor o igual a 0.';
    }
    return '';
  }

  guardarProducto(): void {
    const candidato: Producto = {
      id: Number(this.formulario.id),
      nombre: this.formulario.nombre.trim(),
      categoria: this.formulario.categoria,
      precio: Number(this.formulario.precio),
      stock: Number(this.formulario.stock),
    };

    const error = this.validarProducto(candidato, this.editandoId !== null);
    if (error) {
      this.mensajeError = error;
      this.mensajeEstado = '';
      return;
    }

    this.mensajeError = '';

    if (this.editandoId !== null) {
      this.productos = this.productos.map((p) =>
        p.id === this.editandoId ? candidato : p
      );
      this.mensajeEstado = `Producto "${candidato.nombre}" actualizado correctamente.`;
      this.editandoId = null;
    } else {
      this.agregarProducto(candidato);
      this.mensajeEstado = `Producto "${candidato.nombre}" agregado al inventario.`;
    }

    this.formulario = this.crearFormularioVacio();
  }

  agregarProducto(nuevo: Producto): void {
    this.productos = [...this.productos, nuevo];
  }

  buscarPorId(): void {
    this.mensajeBusquedaId = '';
    this.resultadoBusquedaId = null;

    if (this.idBuscado === null || Number.isNaN(Number(this.idBuscado))) {
      this.mensajeBusquedaId = 'Ingresa un ID numérico para buscar.';
      return;
    }

    const encontrado = this.productos.find((p) => p.id === Number(this.idBuscado));
    if (encontrado) {
      this.resultadoBusquedaId = encontrado;
    } else {
      this.mensajeBusquedaId = `No se encontró ningún producto con el ID ${this.idBuscado}.`;
    }
  }

  editarProducto(producto: Producto): void {
    this.editandoId = producto.id;
    this.mensajeError = '';
    this.formulario = { ...producto };
  }

  eliminarProducto(id: number): void {
    const objetivo = this.productos.find((p) => p.id === id);
    if (!objetivo) return;

    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar "${objetivo.nombre}" (ID ${objetivo.id})?`
    );
    if (!confirmado) return;

    this.productos = this.productos.filter((p) => p.id !== id);
    if (this.resultadoBusquedaId?.id === id) {
      this.resultadoBusquedaId = null;
    }
    if (this.editandoId === id) {
      this.cancelarEdicion();
    }
    this.mensajeEstado = `Producto "${objetivo.nombre}" eliminado.`;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.mensajeError = '';
    this.formulario = this.crearFormularioVacio();
  }
}
