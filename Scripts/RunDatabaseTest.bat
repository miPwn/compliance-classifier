@echo off
echo Compiling and running database test script...

REM Create a temporary project for the test script
mkdir TestProject
cd TestProject

REM Initialize a new console project
dotnet new console

REM Add Npgsql package
dotnet add package Npgsql

REM Copy the test script to the project
copy ..\TestDatabaseConnection.cs Program.cs

REM Build and run the project
dotnet build
dotnet run

REM Clean up
cd ..
rmdir /s /q TestProject

echo Test completed.
pause