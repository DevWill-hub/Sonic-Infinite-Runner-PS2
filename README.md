<h1 align="center">Sonic Infinite Runner PS2</h1>

## Sobre

Um jogo de corrida infinita no estilo do icônico ouriço azul. Inspirado no “T‑Rex Game” do Chrome, mas com a velocidade e os anéis do Sonic.

Projeto originalmente criado em **JavaScript & TypeScript** com a biblioteca [Kaplayjs](https://github.com/kaplayjs/kaplay), recriado para a engine [AthenaEnv](https://github.com/DanielSant0s/AthenaEnv), trazendo a experiência de um endless runner simples, porém com mecânicas inspiradas nos clássicos jogos do Sonic.


[![🎮 Game Preview](https://img.shields.io/badge/🎮-Game_Preview-blue?style=for-the-badge&logo=AthenaEnv&logoColor=white)](PREVIEW.md)

### O jogo conta com dois modos distintos

- **Modo Infinito**  
  Inspirado na mecânica de Flappy Bird/T‑Rex Game: desvie de obstáculos enquanto coleta pontos. A dificuldade aumenta progressivamente, com a velocidade do jogo se intensificando conforme o avanço, exigindo reflexos cada vez mais apurados.

- **Modo Normal**  
  Versão infinita sem aumento de dificuldade, mantendo velocidade constante. Ideal para praticar e se familiarizar com controles e mecânicas antes de encarar o modo Infinito.

## Como jogar
Você precisará de um emulador de PlayStation 2 (como [PCSX2](https://pcsx2.net/)) ou de um console com suporte para homebrew (como [wLaunchELF](https://israpps.github.io/projects/wlaunchelf-isr) ou [OPL](https://github.com/ps2homebrew/Open-PS2-Loader/releases/tag/v1.1.0)).

### 1. Baixe o jogo
Acesse a [**Página de Lançamentos**](https://github.com/DevWill-hub/Sonic-Infinite-Runner-PS2/releases/tag/Versions) e baixe o formato de sua preferência.

### 2. Executando o jogo

#### Em um emulador (PCSX2 / AetherSX2)
**Versão ISO:** Carregue o arquivo `.iso` diretamente no emulador.

**Versão ELF:** Habilite "Sistema de Arquivos Host" nas configurações do PCSX2 e execute o arquivo `.elf` em `Sistema > Executar ELF...`.

> Nota: O emulador **AetherSX2** não suporta o carregamento do `.elf` do athena, mas apenas a **versão ELF**, a **versão ISO** você pode jogar normalmente.

#### No hardware original (PS2)
**Versão ISO (via OPL):** Coloque o arquivo `.iso` na sua pasta `DVD` e execute com OPL.

**Versão ELF (via uLaunchELF):** Execute o arquivo `.elf` do seu pendrive usando o uLaunchELF.

## Controles

| Botão             | Ação                  |
| ------------------ | ----------------------- |
| **D-Pad / LEFT DOWN** | Mover Cursor         |
| **X Button**       | Jump                    |
| **START**          | Confirmar Ação             |

## Status do Projeto

**🟢 Concluído** - Versão 1.8.4

O projeto está finalizado com todas as funcionalidades principais implementadas.

## Links

**Jogar Online:** https://jslegend.itch.io/sonic-ring-run  
**Gameplay/Tutorial Web:** https://youtu.be/pAoXi98iJJ4?si=_AZ0OcRQht6ymp7d  
**Repositório Web:** https://github.com/JSLegendDev/sonic-runner  
**Repositório PS2:** https://github.com/DevWill-hub/Sonic-Infinite-Runner-PS2

## Créditos

- [AthenaEnv](https://github.com/DanielSant0s/AthenaEnv): Engine utilizada para a criação de aplicativos e jogos em JS para o PlayStation 2, por [DanielSantos](https://github.com/DanielSant0s).
- Versão Original: Criando por [JSLegendDev](https://github.com/JSLegendDev)
- Fonte: [ManiaFont](https://www.dafont.com/mania.font)
- Port PS2: [Dev Will](https://github.com/DevWill-hub)
