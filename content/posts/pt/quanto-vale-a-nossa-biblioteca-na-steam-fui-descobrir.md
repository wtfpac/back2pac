---
title: Quanto vale a nossa biblioteca na Steam? Fui descobrir
date: 2026-09-30
summary: Criei o SFGraphs para descobrir quem comprou o quê, quanto vale a
  biblioteca e quantos jogos repetidos temos na nossa família da Steam.
categories:
  - gaming
---
Eu e meus amigos dividimos muitos jogos no Steam Family. Um compra, todo mundo joga. Funciona muito bem, até alguém perguntar: "peraí, quem comprou esse jogo? E esse aqui, a gente não tinha já?"

A Steam não responde essas perguntas. Então fiz o SFGraphs.

A primeira vez que o gráfico da linha do tempo apareceu na tela, com cada compra de cada pessoa ao longo dos anos, foi um daqueles momentos de "tá, valeu a pena". Dá para ver quem mais trouxe jogo para a família e quanto a biblioteca de cada um vale pelo preço pago no dia. Dá para ver também os jogos que a gente comprou em dobro sem saber (sim, isso aconteceu mais de uma vez) e quem joga os jogos de quem. O site ainda avisa no nosso Discord quando alguém compra algo novo ou quando um jogo da lista de desejos entra em promoção.

Por trás tem C# com .NET 10 e Blazor, PostgreSQL, as APIs da Steam e o IsThereAnyDeal para o histórico de preços. O que mais me fez quebrar a cabeça foi descobrir o preço de cada jogo no dia em que ele foi comprado e respeitar os limites das APIs sem deixar o site lento.

Começou como curiosidade entre amigos e virou um projeto que eu tenho muito orgulho de mostrar. Se você também divide jogos numa família da Steam, entra lá e descobre os números de vocês:

<https://sfgraphs.onrender.com>
