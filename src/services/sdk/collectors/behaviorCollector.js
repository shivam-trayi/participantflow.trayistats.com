/**
 * Behavior Collector
 * Collects behavioral data (mouse, scroll, clicks, typing)
 */

export class BehaviorCollector {
  mouseMovements = [];
  scrollEvents = [];
  clickEvents = [];
  keypresses = 0;
  startTime = Date.now();
  isCollecting = false;

  /**
   * Start collecting behavioral data
   */
  start() {
    if (this.isCollecting) return;
    this.isCollecting = true;

    // Mouse movements
    document.addEventListener('mousemove', this.handleMouseMove, {
      passive: true
    });

    // Touch events (for mobile)
    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: true
    });
    document.addEventListener('touchstart', this.handleTouchStart, {
      passive: true
    });

    // Scroll events
    window.addEventListener('scroll', this.handleScroll, {
      passive: true
    });

    // Click events
    document.addEventListener('click', this.handleClick, {
      passive: true
    });

    // Keypress events
    document.addEventListener('keypress', this.handleKeypress, {
      passive: true
    });
  }

  /**
   * Stop collecting behavioral data
   */
  stop() {
    this.isCollecting = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keypress', this.handleKeypress);
  }
  handleMouseMove = e => {
    this.mouseMovements.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
    // Limit array size to prevent memory issues
    if (this.mouseMovements.length > 100) {
      this.mouseMovements.shift();
    }
  };
  handleTouchMove = e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouseMovements.push({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
      if (this.mouseMovements.length > 100) {
        this.mouseMovements.shift();
      }
    }
  };
  handleTouchStart = e => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.clickEvents.push({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      });
      if (this.clickEvents.length > 50) {
        this.clickEvents.shift();
      }
    }
  };
  handleScroll = () => {
    this.scrollEvents.push({
      y: window.scrollY,
      timestamp: Date.now()
    });
    if (this.scrollEvents.length > 50) {
      this.scrollEvents.shift();
    }
  };
  handleClick = e => {
    this.clickEvents.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    });
    if (this.clickEvents.length > 50) {
      this.clickEvents.shift();
    }
  };
  handleKeypress = () => {
    this.keypresses++;
  };

  /**
   * Get collected behavioral data
   */
  getData() {
    const sessionDuration = Date.now() - this.startTime;
    const typingSpeed = this.keypresses / (sessionDuration / 60000); // per minute

    return {
      mouseMovements: this.mouseMovements,
      scrollEvents: this.scrollEvents,
      clickEvents: this.clickEvents,
      sessionDuration,
      typingSpeed,
      keypresses: this.keypresses
    };
  }
}