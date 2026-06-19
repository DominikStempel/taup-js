import { TauPTime } from "../src/TauPTime";

describe("TauPTime - IASP91", () => {
  const taup = new TauPTime({ model: "iasp91" });

  test("P wave at 30 degrees, surface source", () => {
    const arrivals = taup.calculate(0, 30, ["P"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].phase).toBe("P");
    expect(arrivals[0].time).toBeGreaterThan(300);
    expect(arrivals[0].time).toBeLessThan(380);
  });

  test("S wave at 30 degrees", () => {
    const arrivals = taup.calculate(0, 30, ["S"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].phase).toBe("S");
    const p = taup.calculate(0, 30, ["P"])[0];
    expect(arrivals[0].time).toBeGreaterThan(p.time);
  });

  test("P wave arrives before S wave", () => {
    const arrivals = taup.calculate(0, 60, ["P", "S"]);
    expect(arrivals.length).toBe(2);
    expect(arrivals[0].phase).toBe("P");
    expect(arrivals[1].phase).toBe("S");
    expect(arrivals[0].time).toBeLessThan(arrivals[1].time);
  });

  test("P at 60 degrees ~590-640 s", () => {
    const arrivals = taup.calculate(0, 60, ["P"]);
    expect(arrivals[0].time).toBeGreaterThan(580);
    expect(arrivals[0].time).toBeLessThan(650);
  });

  test("PcP reflected off core at 30 degrees", () => {
    const arrivals = taup.calculate(0, 30, ["PcP"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].time).toBeGreaterThan(400);
    expect(arrivals[0].time).toBeLessThan(600);
  });

  test("PKP at 150 degrees", () => {
    const arrivals = taup.calculate(0, 150, ["PKP"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].time).toBeGreaterThan(1000);
    expect(arrivals[0].time).toBeLessThan(1300);
  });

  test("source at depth 100 km - P at 30 deg", () => {
    const arrivals = taup.calculate(100, 30, ["P"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].time).toBeGreaterThan(250);
    expect(arrivals[0].time).toBeLessThan(380);
  });

  test("arrivals have required fields", () => {
    const arrivals = taup.calculate(0, 45, ["P"]);
    const a = arrivals[0];
    expect(typeof a.time).toBe("number");
    expect(typeof a.rayParam).toBe("number");
    expect(typeof a.takeoffAngle).toBe("number");
    expect(typeof a.incidentAngle).toBe("number");
    expect(a.phase).toBe("P");
    expect(Array.isArray(a.piercePoints)).toBe(true);
  });

  test("no arrivals outside valid range", () => {
    const arrivals = taup.calculate(0, 110, ["P"]);
    if (arrivals.length > 0) {
      expect(arrivals[0].time).toBeGreaterThan(0);
    }
  });
});

describe("TauPTime - AK135", () => {
  const taup = new TauPTime({ model: "ak135" });

  test("P wave at 45 degrees", () => {
    const arrivals = taup.calculate(0, 45, ["P"]);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].time).toBeGreaterThan(480);
    expect(arrivals[0].time).toBeLessThan(530);
  });
});

describe("TauPTime - velocity lookup", () => {
  const taup = new TauPTime({ model: "iasp91" });

  test("surface P velocity ~5.8 km/s", () => {
    expect(taup.velocityAt(0, "P")).toBeCloseTo(5.8, 1);
  });

  test("below Moho P velocity ~8 km/s", () => {
    expect(taup.velocityAt(40, "P")).toBeGreaterThan(7.5);
  });
});

describe("TauPTime - supported phases", () => {
  test("returns list of phase names", () => {
    const phases = TauPTime.supportedPhases();
    expect(phases).toContain("P");
    expect(phases).toContain("S");
    expect(phases).toContain("PcP");
    expect(phases).toContain("PKP");
  });

  test("supported models", () => {
    const models = TauPTime.supportedModels();
    expect(models).toContain("iasp91");
    expect(models).toContain("ak135");
    expect(models).toContain("prem");
  });
});
