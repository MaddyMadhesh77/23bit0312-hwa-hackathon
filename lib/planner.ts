// Pure, unit-testable planner functions

/** Recommend a kit size based on dog weight in kg. */
export function recommendSize(weightKg: number): 'S' | 'M' | 'L' {
  if (weightKg < 12) return 'S'
  if (weightKg <= 25) return 'M'
  return 'L'
}

/** Chamber tray names in the three energy orderings. */
const lowEnergyTrays = [
  'Scent-hide pocket',
  'Slide-lid tray',
  'Pull-the-tab drawer',
  'Nose-flip flap',
  'Roll-out ball maze',
  'Lick-and-twist cup',
] as const

const mediumEnergyTrays = [
  'Slide-lid',
  'Nose-flip',
  'Roll-out maze',
  'Scent-hide',
  'Lick-and-twist',
  'Pull-the-tab',
] as const

const highEnergyTrays = [
  'Roll-out ball maze',
  'Nose-flip flap',
  'Lick-and-twist cup',
  'Slide-lid tray',
  'Scent-hide pocket',
  'Pull-the-tab drawer',
] as const

export type Energy = 'low' | 'medium' | 'high'

/** Return the tray order for the given energy level. */
function traysForEnergy(energy: Energy): readonly string[] {
  switch (energy) {
    case 'low':
      return lowEnergyTrays
    case 'medium':
      return mediumEnergyTrays
    case 'high':
      return highEnergyTrays
    default:
      return mediumEnergyTrays
  }
}

/** Clamp a value between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Round to nearest integer (banker's rounding not needed, simple). */
function roundToNearest(value: number): number {
  return Math.round(value)
}

/**
 * Plan a session for a dog.
 *
 * Returns: size, chambers (one per hour, tray ordered by energy), and any notes.
 */
export function planSession(
  weightKg: number,
  energy: Energy,
  hoursAlone: number,
) {
  const size = recommendSize(weightKg)

  // Chamber count = clamp(round(hoursAlone), 1, 6), one chamber per hour
  const chamberCount = clamp(roundToNearest(hoursAlone), 1, 6)

  // Select trays in the order for this energy level, take chamberCount many
  const trays = traysForEnergy(energy)
  const selectedTrays = trays.slice(0, chamberCount)

  // Build chambers: one chamber per hour, labeled with hour number and tray
  const chambers = selectedTrays.map((tray, index) => {
    const hour = index + 1 // hours start at 1
    return { hour, tray }
  })

  // Build tip strings for each chamber
  const tipChambers = chambers.map(({ hour, tray }) => {
    // Each chamber gets a simple tip based on the tray
    const tips: Record<string, string> = {
      'Scent-hide pocket': 'Tap into your dog\'s instinct to track scent trails.',
      'Slide-lid tray': 'Sliding a lid reveals a hidden compartment.',
      'Pull-the-tab drawer': 'A drawer that extends when a tab is pulled.',
      'Nose-flip flap': 'A spring-loaded flap that flips up when nudged.',
      'Roll-out ball maze': 'A ball that rolls out slowly when pushed.',
      'Lick-and-twist cup': 'A textured cup that dispenses treats when licked.',
    }
    return { hour, tray, tip: tips[tray] || '' }
  })

  // Collect notes
  const notes: string[] = []

  if (weightKg > 45) {
    notes.push('Size L — supervise closely, this is a strong chewer range.')
  }
  if (hoursAlone > 6) {
    notes.push('Refill midday for full-day coverage.')
  }

  const note = notes.length > 0 ? notes.join(' ') : ''

  return {
    size,
    chambers,
    tipChambers,
    note,
  }
}

// Helpers for the UI

/** Get the weight range string for a size. */
export function sizeWeightRange(size: 'S' | 'M' | 'L'): [number, number] {
  const ranges: Record<'S' | 'M' | 'L', [number, number]> = {
    S: [5, 12],
    M: [12, 25],
    L: [25, 45],
  }
  return ranges[size]
}

/** Get the product ID for a given size. */
export function sizeProductId(size: 'S' | 'M' | 'L'): string {
  const map: Record<'S' | 'M' | 'L', string> = {
    S: 'ticktail-s',
    M: 'ticktail-m',
    L: 'ticktail-l',
  }
  return map[size]
}

/** Format size as display text, e.g. "Small (5–12 kg)". */
export function sizeDisplayText(size: 'S' | 'M' | 'L'): string {
  const [min, max] = sizeWeightRange(size)
  return `${size === 'S' ? 'Small' : size === 'M' ? 'Medium' : 'Large'} (${min}–${max} kg)`
}