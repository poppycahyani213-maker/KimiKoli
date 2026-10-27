/**
 * Colligative Properties Calculation Engine
 * Reference: Indonesian High School Chemistry Curriculum (Fase F Kelas 11)
 */

import { calculateVantHoffFactor } from './vantHoff.js';

export const GAS_CONSTANT_R = 0.082; // L·atm / (mol·K)

/**
 * Calculate molality (m) in mol/kg
 * m = (massSolute / mr) * (1000 / massSolventGram)
 */
export function calculateMolality(massSolute, mr, massSolventGram) {
  if (!massSolute || !mr || !massSolventGram || massSolventGram <= 0 || mr <= 0) {
    return 0;
  }
  const molesSolute = massSolute / mr;
  const kgSolvent = massSolventGram / 1000;
  return molesSolute / kgSolvent;
}

/**
 * Calculate mole fractions
 */
export function calculateMoleFractions(massSolute, mrSolute, massSolvent, mrSolvent, vantHoff = 1) {
  if (!massSolute || !mrSolute || !massSolvent || !mrSolvent) {
    return { xSolute: 0, xSolvent: 1, molesSolute: 0, molesSolvent: 0 };
  }
  
  const molesSolute = massSolute / mrSolute;
  const effectiveMolesSolute = molesSolute * vantHoff;
  const molesSolvent = massSolvent / mrSolvent;
  const totalMoles = effectiveMolesSolute + molesSolvent;
  
  if (totalMoles === 0) return { xSolute: 0, xSolvent: 1, molesSolute: 0, molesSolvent: 0 };
  
  return {
    xSolute: effectiveMolesSolute / totalMoles,
    xSolvent: molesSolvent / totalMoles,
    molesSolute,
    molesSolvent
  };
}

/**
 * Raoult's Law: Vapor Pressure Lowering
 * ΔP = Xt * P°
 * P = P° - ΔP
 */
export function calculateVaporPressureLowering(p0, xSolute) {
  const deltaP = (p0 || 0) * (xSolute || 0);
  const pSolution = Math.max(0, (p0 || 0) - deltaP);
  return { deltaP, pSolution };
}

/**
 * Boiling Point Elevation
 * ΔTb = Kb * m * i
 * Tb = Tb0 + ΔTb
 */
export function calculateBoilingPointElevation(kb, molality, vantHoff = 1, normalTb = 100) {
  const deltaTb = (kb || 0) * (molality || 0) * (vantHoff || 1);
  const boilingPoint = (normalTb || 100) + deltaTb;
  return { deltaTb, boilingPoint };
}

/**
 * Freezing Point Depression
 * ΔTf = Kf * m * i
 * Tf = Tf0 - ΔTf
 */
export function calculateFreezingPointDepression(kf, molality, vantHoff = 1, normalTf = 0) {
  const deltaTf = (kf || 0) * (molality || 0) * (vantHoff || 1);
  const freezingPoint = (normalTf || 0) - deltaTf;
  return { deltaTf, freezingPoint };
}

/**
 * Osmotic Pressure
 * π = M * R * T * i
 * @param {number} molarity - M in mol/L
 * @param {number} tempCelsius - Temperature in °C
 * @param {number} vantHoff - van 't Hoff factor i
 */
export function calculateOsmoticPressure(molarity, tempCelsius = 25, vantHoff = 1) {
  const tempKelvin = tempCelsius + 273;
  const pi = (molarity || 0) * GAS_CONSTANT_R * tempKelvin * (vantHoff || 1);
  return { pi, tempKelvin };
}

