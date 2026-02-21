<h1 align="center">Sonic Infinite Runner PS2</h1>

## Sobre

Um jogo de corrida infinita no estilo do icônico ouriço azul. Inspirado no “T‑Rex Game” do Chrome, mas com a velocidade e os anéis do Sonic.

Projeto originalmente criado em **JavaScript & TypeScript** com a biblioteca [Kaplayjs](https://github.com/kaplayjs/kaplay), recriado para o ambiente [AthenaEnv](https://github.com/DanielSant0s/AthenaEnv), trazendo a experiência de um endless runner simples, porém com mecânicas inspiradas nos clássicos jogos do Sonic.

[![🎮 Game Preview](https://img.shields.io/badge/🎮-Ver_Preview-blue?style=for-the-badge)](PREVIEW.md)

### O jogo conta com dois modos distintos

- **Modo Infinito**  
  Inspirado na mecânica de Flappy Bird/T‑Rex Game: desvie de obstáculos enquanto coleta pontos. A dificuldade aumenta progressivamente, com a velocidade do jogo se intensificando conforme o avanço, exigindo reflexos cada vez mais apurados.

- **Modo Normal**  
  Versão infinita sem aumento de dificuldade, mantendo velocidade constante. Ideal para praticar e se familiarizar com controles e mecânicas antes de encarar o modo Infinito.

## Como jogar

Você pode jogar no **PlayStation 2 original** (com homebrew) ou em **emuladores** como [PCSX2](https://pcsx2.net/) (PC) e [AetherSX2](https://www.aethersx2.com.br/) (Android).

### 1. Baixe o jogo
Acesse a [**Página de Lançamentos**](https://github.com/DevWill-hub/Sonic-Infinite-Runner-PS2/releases/tag/Versions) e baixe a versão desejada (ISO ou ELF).

### 2. Executando o jogo

#### Emulador (PCSX2 / AetherSX2)

**Versão ISO:**
- Carregue o arquivo `.iso` diretamente no emulador (igual qualquer jogo de PS2).

**Versão ELF (PCSX2 apenas):**
- Descompacte o arquivo `.zip` baixado.
- Habilite o **Sistema de Arquivos Host** nas configurações do emulador.
- Vá em `Sistema > Executar ELF...` e selecione o arquivo `.elf` extraído.

> **AetherSX2 não suporta arquivos ELF** por não oferecer o recurso de "Host Filesystem" (necessário para o AthenaEnv). Use a versão ISO neste caso.

#### PlayStation 2 original

**Versão ISO (via OPL):**
- Copie o arquivo `.iso` para a pasta `DVD` no seu dispositivo de armazenamento (recomendado: USB) e execute pelo [OPL](https://github.com/ps2homebrew/Open-PS2-Loader).

**Versão ELF (via wLaunchELF):**
- Descompacte o `.zip` e copie a pasta do jogo para a raiz do seu pendrive.
- Execute o [wLaunchELF](https://israpps.github.io/projects/wlaunchelf-isr), navegue até o arquivo `.elf` e pressione **X** para iniciar.

> Você pode usar qualquer outro executor de ELF compatível com PS2, desde que o AthenaEnv funcione corretamente.

## Controles

### Menu de Seleção
| Botão | Ação |
|-------|------|
| **D-Pad (CIMA/BAIXO)** | Navegar entre as opções |
| **START** | Confirmar modo de jogo |

### Durante o Jogo
| Botão | Ação |
|-------|------|
| **Botão X** | Pular |

> **Nota:** No menu secundário, uma dica logo em baixo da logo (Sonic Ring Run) indica que o **Botão X** é usado para pular durante o jogo.

## Status do Projeto

**🟢 Concluído** - Versão 1.8.4

O projeto está finalizado com todas as funcionalidades principais implementadas.

## Links

**Jogar Online:** https://jslegend.itch.io/sonic-ring-run  
**Gameplay/Tutorial Web:** https://youtu.be/pAoXi98iJJ4?si=_AZ0OcRQht6ymp7d  
**Repositório Web:** https://github.com/JSLegendDev/sonic-runner  
**Repositório PS2:** https://github.com/DevWill-hub/Sonic-Infinite-Runner-PS2

## Créditos

- **[AthenaEnv](https://github.com/DanielSant0s/AthenaEnv)** – Ambiente de execução JavaScript para criação de aplicativos e jogos para o PlayStation 2, desenvolvido por [DanielSantos](https://github.com/DanielSant0s).  
- **[Sonic Ring Run (Original)](https://jslegend.itch.io/sonic-ring-run)** – Jogo original criado por [JSLegendDev](https://github.com/JSLegendDev).  
- **[ManiaFont](https://www.dafont.com/mania.font)** – Fonte utilizada no projeto.  
- **Autor** – [Dev Will](https://github.com/DevWill-hub).