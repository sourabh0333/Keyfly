# Speaks the illustrative film's voice-over lines with a Windows voice and
# saves one WAV per line in scripts/keyfly-film/voice/ (film.js plays them at
# their scenes). A placeholder until KeyFly's own AI voice can be used.
#
# Usage (Windows PowerShell): powershell -File scripts/keyfly-film/voice.ps1
# Then print each line's length: the scene timings in film.js must leave room.

Add-Type -AssemblyName System.Speech

$lines = [ordered]@{
  "01" = "Describe the video you want."
  "02" = "One sentence is enough to start."
  "03" = "KeyFly writes the storyboard, scene by scene."
  "04" = "It records the voice-over,"
  "05" = "and builds the motion graphics."
  "06" = "Everything lands on a real timeline."
  "07" = "Then change anything, just by asking."
  "08" = "Describe it. KeyFly makes it."
}

$out = Join-Path $PSScriptRoot "voice"
New-Item -ItemType Directory -Force $out | Out-Null

$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.SelectVoice("Microsoft Hazel Desktop")
$voice.Rate = 0
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)

foreach ($key in $lines.Keys) {
  $file = Join-Path $out "$key.wav"
  $voice.SetOutputToWaveFile($file, $format)
  $voice.Speak($lines[$key])
  $voice.SetOutputToNull()
  $seconds = ((Get-Item $file).Length - 44) / (24000 * 2)
  "{0}  {1:N2}s  {2}" -f $key, $seconds, $lines[$key]
}
$voice.Dispose()
