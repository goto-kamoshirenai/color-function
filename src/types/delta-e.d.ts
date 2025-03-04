declare module "delta-e" {
  interface Lab {
    L: number;
    a: number;
    b: number;
  }

  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  export function rgb2lab(rgb: RGB): Lab;
  export function getDeltaE00(lab1: Lab, lab2: Lab): number;
}
