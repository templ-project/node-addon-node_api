if ($env:DEBUG) {
  Set-PSDebug -trace 2
}

# https://clang.llvm.org/extra/clang-tidy/
npx node-gyp configure >$null 2>&1

$paths = cat .\build\main.vcxproj `
  | Select-String -Pattern 'AdditionalIncludeDirectories' `
  | ForEach-Object {
    $line = $_ -replace "<AdditionalIncludeDirectories>", ""
    $line = $line -replace "</AdditionalIncludeDirectories>", ""
    $line = $line -replace ";%\(AdditionalIncludeDirectories\)", ""
    echo $line.Trim().Split(';')
  } `
  | ForEach-Object {
    if (Test-Path $_ -PathType Container) {
      echo $_
    }
    $lp = (Get-Item $MyInvocation.MyCommand.Path).Directory.FullName + '\' + $_
    if (Test-Path "$lp" -PathType Container) {
      echo (Resolve-Path -Path $lp).Path
    }
    $lp = (Get-Item $MyInvocation.MyCommand.Path).Directory.FullName + '\..\' + $_
    if (Test-Path "$lp" -PathType Container) {
      echo (Resolve-Path -Path $lp).Path
    }
  }  `
  | ForEach-Object {
    echo "-I$_"
  } `
  | select -Unique

if ($env:CLANG_CUSTOM_IMPORTS) {
  $paths = $paths + $env:CLANG_CUSTOM_IMPORTS.Split(' ')
}

$CLANG_COMMAND = "clang-tidy"
$CLANG_ARGS = $args + @("--") + $paths


$CLANG = (Get-Command $CLANG_COMMAND).Path
if ($CLANG -ne $CLANG_COMMAND) {
  Write-Host -ForegroundColor Green "${CLANG_COMMAND} discoverd at ${CLANG}"
} else {
  Write-Host -ForegroundColor Red "Could not find clang-format."
  Write-Host -ForegroundColor Red "Please make sure to install LLVM https://github.com/llvm/llvm-project/releases/"
  Write-Host -ForegroundColor Red "And also make sure you have added LLVM path to `$env:PATH"
  exit 1
}


$lintErrors=0
$Arguments = $args
foreach ($ext in "*.c", "*.cc", "*.cpp", "*.h") {
  Get-ChildItem -Path .\src -Filter $ext -Recurse -File -Name | ForEach-Object {
    $Arguments = @(".\src\$_") + $CLANG_ARGS

    $ErrorActionPreference = 'silentlycontinue'
    $lintResult = (& $CLANG $Arguments 2>&1)
    $ErrorActionPreference= 'continue'

    if ($lintResult -ne "") {
      if ($lintResult -Contains "error") {
        Write-Host -ForegroundColor Red ".\src\$_"
        $lintErrors = $lintErrors + 1
      } else {
        Write-Host -ForegroundColor Yellow ".\src\$_"
      }
      $ErrorActionPreference = 'silentlycontinue'
      & $CLANG $Arguments 2>&1
      $ErrorActionPreference= 'continue'
    } else {
      Write-Host -ForegroundColor DarkGray ".\src\$_"
    }
  }
}

if ($env:DEBUG -ne "") {
  Set-PSDebug -off
}

if ($lintErrors -gt 0) {
  exit 1
}
