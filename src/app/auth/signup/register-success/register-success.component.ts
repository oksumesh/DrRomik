import { Component, EventEmitter, Input, Output } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css'
})
export class RegisterSuccessComponent {
  @Input() isVisible = false; // Input property to control visibility
  @Output() close = new EventEmitter<void>(); // Output event to notify parent component

  onClose() {
    this.close.emit(); // Emit close event when close button is clicked
  }
}
