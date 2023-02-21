import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css'],
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public passwordToCheck: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;

  private colors = ['darkred', 'yellow', 'yellowgreen'];

  private static checkStrength(p) {
    let force = 0;
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

    const letters = /[a-zA-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);

    const flags = [letters, numbers, symbols];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    force += 2 * p.length + (p.length >= 8 ? 1 : 0);
    force += passedMatches * 8;

    // short password
    force = p.length <= 7 ? Math.min(force, 10) : force;

    // poor variety of characters
    force = passedMatches === 1 ? Math.min(force, 10) : force;
    force = passedMatches === 2 ? Math.min(force, 20) : force;
    force = passedMatches === 3 ? Math.min(force, 30) : force;
    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;
    this.setBarColors(3, '#DDD');
    if (password.length <= 7) {
      this.setBarColors(3, 'darkred');
    }
    if (password === '') {
      this.setBarColors(3, '#DDD');
    }
    if (password) {
      const c = this.getColor(
        PasswordStrengthComponent.checkStrength(password)
      );
      this.setBarColors(c.idx, c.col);
      const pwdStrength = PasswordStrengthComponent.checkStrength(password);
      pwdStrength === 20
        ? this.passwordStrength.emit(true)
        : this.passwordStrength.emit(false);
    }
  }

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else {
      idx = 2;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }
}
