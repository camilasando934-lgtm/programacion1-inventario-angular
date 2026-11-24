import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
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
  productos: Producto[] = [
    { id: 1, nombre: 'Cuaderno universitario', categoria: 'Papelería', precio: 2.5, stock: 25 },
    { id: 2, nombre: 'Teclado USB', categoria: 'Tecnología', precio: 14.0, stock: 10 },
  ];

  terminoBusqueda = '';
  editandoId: number | null = null;

  nuevoProducto: Omit<Producto, 'id'> = {
    nombre: '',
    categoria: '',
    precio: 0,
    stock: 0,
  };

  get productosFiltrados(): Producto[] {
    const q = this.terminoBusqueda.trim().toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
  }

  guardarProducto(): void {
    const nombreLimpio = this.nuevoProducto.nombre.trim();
    const categoriaLimpia = this.nuevoProducto.categoria.trim();
    if (!nombreLimpio || !categoriaLimpia) return;

    if (this.editandoId !== null) {
      this.productos = this.productos.map((p) =>
        p.id === this.editandoId
          ? { ...p, ...this.nuevoProducto, nombre: nombreLimpio, categoria: categoriaLimpia }
          : p
      );
      this.editandoId = null;
    } else {
      const siguienteId =
        this.productos.length > 0
          ? Math.max(...this.productos.map((p) => p.id)) + 1
          : 1;
      this.productos.push({
        id: siguienteId,
        nombre: nombreLimpio,
        categoria: categoriaLimpia,
        precio: Number(this.nuevoProducto.precio) || 0,
        stock: Number(this.nuevoProducto.stock) || 0,
      });
    }

    this.limpiarFormulario();
  }

  editarProducto(producto: Producto): void {
    this.editandoId = producto.id;
    this.nuevoProducto = {
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
    };
  }

  eliminarProducto(id: number): void {
    this.productos = this.productos.filter((p) => p.id !== id);
    if (this.editandoId === id) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario(): void {
    this.editandoId = null;
    this.nuevoProducto = { nombre: '', categoria: '', precio: 0, stock: 0 };
  }
}

