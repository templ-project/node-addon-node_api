if ($env:DEBUG) {
  Set-PSDebug -trace 2
}

$CLANG_COMMAND = "clang-format"
$CLANG_ARGS = "--verbose", "-style=file"

$CLANG = (Get-Command $CLANG_COMMAND).Path
if ($CLANG -ne $CLANG_COMMAND) {
  Write-Host -ForegroundColor Green "${CLANG_COMMAND} discoverd at ${CLANG}"
} else {
  Write-Host -ForegroundColor Red "Could not find clang-format."
  Write-Host -ForegroundColor Red "Please make sure to install LLVM https://github.com/llvm/llvm-project/releases/"
  Write-Host -ForegroundColor Red "And also make sure you have added LLVM path to `$env:PATH"
  exit 1
}

if ($args.Contains('-i')) {
  $Arguments = $args
  foreach ($ext in "*.c", "*.cc", "*.cpp", "*.h") {
    Get-ChildItem -Path .\src -Filter $ext -Recurse -File -Name | ForEach-Object {
      $fileA = ".\src\$_"
      $fileB = "${env:TEMP}\clang-format.tmp"

      Copy-Item -Path .\src\$_ -Destination $fileB -Force
      & $CLANG $CLANG_ARGS $Arguments $fileA;

      if(Compare-Object -ReferenceObject $(Get-Content $fileA) -DifferenceObject $(Get-Content $fileB)) {
        Write-Host -ForegroundColor White $FileA
      } else {
        Write-Host -ForegroundColor DarkGray $fileA
      }
    }
  }
} else {
  foreach ($ext in "*.c", "*.cc", "*.cpp", "*.h") {
    Get-ChildItem -Path .\src -Filter $ext -Recurse -File -Name | ForEach-Object {
      Write-Host -ForegroundColor DarkGray $fileA

      & $CLANG $CLANG_ARGS .\src\$_;
    }
  }
}

if ($env:DEBUG -ne "") {
  Set-PSDebug -off
}
