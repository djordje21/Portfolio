// Kalkulacija cene koštanja tanjira i predložene prodajne cene.
// Čiste funkcije, bez DOM-a, da bi mogle da se testiraju.

export type Unit = 'kg' | 'l' | 'pc';

export interface Ingredient {
  name: string;
  price: number; // nabavna cena po kg / l / kom
  unit: Unit;
  qty: number; // količina po porciji u g / ml / kom
  yield: number; // iskorišćenje u % (npr. 85 za beli luk posle ljuštenja)
}

export interface Settings {
  target: number; // ciljani food cost u %
  qfactor: number; // dodatak za sitne sastojke u %
  vat: number; // PDV u %
  roundStep: number; // korak zaokruživanja menijske cene (sa PDV-om)
}

/** Trošak jedne namirnice po porciji. */
export function ingredientCost(i: Ingredient): number {
  if (!(i.price > 0) || !(i.qty > 0) || !(i.yield > 0)) return 0;
  const perBase = i.unit === 'pc' ? i.qty : i.qty / 1000; // g → kg, ml → l
  return (perBase / (i.yield / 100)) * i.price;
}

export function calculate(items: Ingredient[], s: Settings) {
  const ingredients = items.reduce((sum, i) => sum + ingredientCost(i), 0);
  const plateCost = ingredients * (1 + s.qfactor / 100);
  const target = Math.min(Math.max(s.target, 1), 99) / 100;
  const net = plateCost / target;
  const gross = net * (1 + s.vat / 100);
  // menijska cena: zaokruženo naviše, da food cost ne pređe cilj
  const menu = s.roundStep > 0 ? Math.ceil(gross / s.roundStep - 1e-9) * s.roundStep : gross;
  const menuNet = menu / (1 + s.vat / 100);
  const actualFc = menuNet > 0 ? plateCost / menuNet : 0;
  return { ingredients, plateCost, net, gross, menu, menuNet, actualFc, margin: menuNet - plateCost };
}

/** Korak zaokruživanja po valuti. */
export const roundSteps: Record<string, number> = { EUR: 0.5, USD: 0.5, RSD: 50, RUB: 50 };

/** Približni kursevi samo za prikaz primera u drugoj valuti (ne za obračun). */
export const exampleRates: Record<string, number> = { EUR: 1, RSD: 117, RUB: 100, USD: 1.1 };
