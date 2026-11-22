/* The camera's ride round the table. Stop 0 is the overview; then the three
   featured dishes in the box ("dish-0".."dish-2"), the side plates ("projects"),
   and one stop per section, in the order the orbit passes them going round.
   Shared by the page (keys, scroll, swipes) and the 3D scene (the camera, the drag). */
export const ORBIT = [null, "dish-0", "dish-1", "dish-2", "projects", "about", "experience", "skills", "contact", "connect"];

const N = ORBIT.length;
const mod = (a, n) => ((a % n) + n) % n;

/* Positions are in stops and unbounded: the orbit is a loop, so stop 2 is also
   9, 16 and so on, one lap further round each time. */
export class OrbitNav {
  target = 0; // where the camera is heading; fractional while a scroll is under way
  pos = 0; // where it is now, and how fast it is going: the scene moves these
  v = 0;
  anchor = 0; // the stop the current scroll or swipe set out from
  head = 0; // the stop it is heading for, 0..N-1
  locked = false; // the box is still shut: the first move opens it instead
  reduced = false; // cut between stops rather than ride
  acc = 0; // scroll gathered while motion is reduced
  spent = false; // this scroll or swipe has already done its one thing
  free = false; // left by a mouse drag, off the path: stays put until told to move
  nearest = 0; // the stop nearest the view while free (the scene keeps this current)

  wake = () => {}; // draw a frame (the scene sets this)
  onOpen = () => {};
  onUse = () => {};
  onHead = () => {};

  set(t) {
    this.target = t;
    const h = mod(Math.round(t), N);
    if (h !== this.head) {
      this.head = h;
      this.onHead(h);
    }
    this.wake();
  }

  /* Mark stop i as where things are heading without moving (a drag's landing spot). */
  preview(i) {
    if (i === this.head) return;
    this.head = i;
    this.onHead(i);
  }

  /* Back onto the path at the stop nearest the view, so the next move sets out from there. */
  leaveFree() {
    if (!this.free) return;
    this.free = false;
    const t = this.lap(this.nearest);
    this.pos = t;
    this.v = 0;
    this.anchor = t;
    this.target = t;
  }

  /* Stop i on the lap nearest the camera, so it always goes the short way round. */
  lap(i) {
    return i + N * Math.round((this.pos - i) / N);
  }

  goTo(i) {
    this.leaveFree();
    const t = this.lap(i);
    this.anchor = t;
    this.set(t);
  }

  step(dir) {
    this.onUse();
    this.leaveFree();
    if (this.locked) return this.onOpen();
    const t = Math.round(this.target) + dir;
    this.anchor = t;
    this.set(t);
  }

  /* A scroll or swipe, `d` in stops. It drags the camera along the path, at most
     one stop either way per gesture; `release` then settles it on a stop. */
  scrub(d) {
    if (this.spent) return;
    this.onUse();
    this.leaveFree();
    if (this.locked) {
      this.spent = true;
      this.onOpen();
      return;
    }
    if (this.reduced) {
      this.acc += d;
      if (Math.abs(this.acc) > 0.3) {
        this.spent = true;
        const t = this.anchor + Math.sign(this.acc);
        this.anchor = t;
        this.set(t);
      }
      return;
    }
    this.set(Math.max(this.anchor - 1, Math.min(this.anchor + 1, this.target + d)));
  }

  /* The gesture is over. Past a small nudge it carries on to the next stop,
     otherwise it settles back. `flick` is the sign of a fast finish. */
  release(flick = 0) {
    if (!this.spent && !this.locked) {
      // reduced motion: the gathered scroll decides, and the camera cuts
      const f = this.reduced ? this.acc : this.target - this.anchor;
      const on = Math.abs(f) > 0.12 || (flick && Math.sign(flick) === Math.sign(f) && Math.abs(f) > 0.02);
      this.set(this.anchor + (on ? Math.sign(f) : 0));
    }
    this.anchor = Math.round(this.target);
    this.acc = 0;
    this.spent = false;
  }
}
