const test = require('tape');
const sfxr = require('../sfxr');

test('sfxr basic functionality', (t) => {
  t.plan(4);

  // Test sound generation
  const sound = sfxr.generateSound();
  t.ok(sound, 'should generate a sound');
  t.ok(sound.length > 0, 'generated sound should have length');

  // Test preset loading
  const preset = sfxr.loadPreset('pickup');
  t.ok(preset, 'should load a preset');
  t.deepEqual(Object.keys(preset), [
    'waveType',
    'masterVolume',
    'frequency',
    'frequencySlide',
    'frequencyDeltaSlide',
    'squareDuty',
    'squareDutySweep',
    'repeatSpeed',
    'arpSpeed',
    'arpMod',
    'attackTime',
    'sustainTime',
    'sustainPunch',
    'decayTime',
    'tremoloDepth',
    'tremoloFrequency',
    'vibratoDepth',
    'vibratoSpeed',
    'vibratoDelay',
    'lpfResonance',
    'lpfCutoff',
    'lpfCutoffSweep',
    'hpfCutoff',
    'hpfCutoffSweep',
    'phaserOffset',
    'phaserSweep',
    'reverbMix',
    'echoDelay',
    'echoFeedback',
    'echoMix'
  ], 'preset should have all required parameters');
}); 