FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["WeddingApp.Api/WeddingApp.Api.csproj", "WeddingApp.Api/"]
COPY ["WeddingApp.Application/WeddingApp.Application.csproj", "WeddingApp.Application/"]
COPY ["WeddingApp.Domain/WeddingApp.Domain.csproj", "WeddingApp.Domain/"]
COPY ["WeddingApp.Infrastructure/WeddingApp.Infrastructure.csproj", "WeddingApp.Infrastructure/"]
RUN dotnet restore "WeddingApp.Api/WeddingApp.Api.csproj"

COPY . .
WORKDIR "/src/WeddingApp.Api"
RUN dotnet build "WeddingApp.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingApp.Api.dll"]
