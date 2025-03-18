export class Cursor {
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  deltaX = 0;
  deltaY = 0;
  button: CursorButtonType | null = null;
  previousDiff = 0;
  currentDiff = 0;

  get start() {
    return { x: this.startX, y: this.startY };
  }

  get current() {
    return { x: this.currentX, y: this.currentY };
  }

  get delta() {
    return { x: this.deltaX, y: this.deltaY };
  }

  get pitchDelta() {
    return this.previousDiff - this.currentDiff;
  }

  resetPitch() {
    this.previousDiff = 0;
    this.currentDiff = 0;
  }

  setStart(e: any) {
    const { currentX, currentY } = this.getCurrentPosition(e);

    this.startX = currentX;
    this.startY = currentY;
    this.currentX = currentX;
    this.currentY = currentY;
  }

  setCurrent(e: any) {
    const { currentX, currentY } = this.getCurrentPosition(e);

    this.currentX = currentX;
    this.currentY = currentY;
  }

  setDelta(e: any) {
    let deltaX: number;
    let deltaY: number;

    if (e.type === 'wheel') {
      deltaX = e.deltaX;
      deltaY = e.deltaY;
    } else if (e.touches && e.touches.length) {
      if (e.touches.length === 2) {
        const pitchDeltaX = e.touches[0].clientX - e.touches[1].clientX;
        const pitchDeltaY = e.touches[0].clientY - e.touches[1].clientY;
        this.currentDiff = Math.sqrt(
          Math.pow(pitchDeltaX, 2) + Math.pow(pitchDeltaY, 2),
        );

        if (this.previousDiff === 0) {
          this.previousDiff = this.currentDiff;
        }
      }

      deltaX = e.touches[0].clientX - this.currentX;
      deltaY = e.touches[0].clientY - this.currentY;
    } else {
      deltaX = e.movementX;
      deltaY = e.movementY;
    }

    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }

  getCurrentPosition(e: any) {
    let currentX: number;
    let currentY: number;

    if (e.touches && e.touches.length) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    return { currentX: Math.round(currentX), currentY: Math.round(currentY) };
  }

  setButton(e: any) {
    if (e.touches) {
      this.button = CursorButton.TOUCH;
      return;
    }

    switch (e.button) {
      case 0: {
        this.button = CursorButton.PRIMARY;
        break;
      }
      case 1: {
        this.button = CursorButton.MIDDLE;
        break;
      }
      case 2: {
        this.button = CursorButton.SECONDARY;
        break;
      }
    }
  }
}

export const CursorButton = {
  PRIMARY: 'PRIMARY',
  MIDDLE: 'MIDDLE',
  SECONDARY: 'SECONDARY',
  TOUCH: 'TOUCH',
} as const;

export type CursorButtonType = keyof typeof CursorButton;
