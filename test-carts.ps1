# Script PowerShell para consulta de carritos con paginación

# 1. Token JWT (coloca aquí tu token válido)
$token = "@y*&0a%K%7P0t@uQ^38HN$y4Z^PK#0zE7dem700Bbf&pC6HF$aU^ARkE@u$nn"
Write-Host "Token JWT usado: $token"

# 2. Consulta de carritos con paginación usando el token
$result = Invoke-RestMethod -Uri "http://localhost:8000/api/carts?page=1&perPage=2" -Headers @{ Authorization = "Bearer $token" }
Write-Host "`nRespuesta de /api/carts:" -ForegroundColor Cyan
$result | ConvertTo-Json -Depth 5
