
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Productos } from './pages/productos/productos';

@Component({
  imports: [RouterOutlet, Productos],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('inventario-pl');
}
