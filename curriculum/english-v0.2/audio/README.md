# Escuta — fila de produção

Há 53 roteiros preparados: seis de fundamentos pré-A1, oito do primeiro bloco A1, sete do primeiro bloco A2, oito do primeiro bloco B1, oito do bloco B2, quatro de avaliação, oito de consolidação pré-A1–B1 e quatro de inteligibilidade. A [fila de produção](../data/audio-queue.json) mantém falas por personagem, fonte e identificação da versão textual. As traduções entre parênteses foram retiradas das falas a gravar; continuam como apoio no guia do professor.

Os 53 roteiros receberam arquivos MP3 sintéticos de apoio. [Catálogo e downloads](CATALOG.md). A produção local usa Piper e a voz en_US-ljspeech-high; o [cartão do modelo](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/high/MODEL_CARD) declara dados de treinamento em domínio público. Modelo e motor não integram a distribuição do currículo. Versões, identificação do modelo, roteiro, duração e integridade estão em `data/audio-production.json`.

**Nenhum arquivo tem revisão auditiva registrada.** São rascunhos sonoros, não gravações pedagogicamente validadas. Os diálogos usam uma voz que anuncia o personagem; esta solução não representa interação entre vozes diferentes. A conexão Runway consultada não oferecia fala, e nenhuma compra foi feita.

## Condições de produção e revisão

- Na versão com múltiplas vozes, gravar somente as falas em inglês. No rascunho atual de voz única, os nomes são anunciados para preservar atribuição; traduções não são faladas.
- Manter o mesmo falante para cada personagem; usar pausas naturais e clareza, sem exagerar ou caricaturar sotaques.
- Registrar pessoa/voz utilizada, variedade declarada quando conhecida, data, versão do roteiro e origem humana ou sintética. Não presumir sotaque pelo nome de uma voz.
- Conferir especialmente nomes, soletração, códigos, horas, negações e correções. Se o áudio mudar um dado, refazer antes de usá-lo na avaliação.
- Separar roteiro de prova da apresentação ao aluno; oferecer transcrição depois da primeira tentativa ou como adaptação identificada.
- Na revisão auditiva, verificar audibilidade, cortes, alternância dos falantes e coincidência com o roteiro. Um arquivo gerado não prova inteligibilidade ou adequação pedagógica.
- Comparar versões com estudantes nas duas modalidades antes de estabelecer ritmo e repetição como definitivos.

A fila cobre diálogos das unidades e avaliações atuais. A fila inclui os quatro roteiros Phonos; ainda faltam séries sonoras dedicadas ao alfabeto e aos itens lexicais, além de diversidade de vozes. A ausência desses áudios continua registrada; não renomear roteiro como arquivo sonoro.

Na biblioteca, os MP3 permitem escuta sem voz instalada no navegador. A síntese do navegador permanece como alternativa quando não houver arquivo. Os roteiros reservados de avaliação não são incluídos automaticamente nesse player. [Estado da produção](../reports/B1-GAP-CLOSURE.md).
