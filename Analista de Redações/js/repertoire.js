// ═══════════════════════════════════════════════
// === BANCO DE REPERTÓRIOS + BUSCA + RENDER ====
// ═══════════════════════════════════════════════

(function () {
    // ═══════════════════════════════════════════════════════════════
    // === BANCO DE REPERTÓRIOS SOCIOCULTURAIS (baseado na skill) ===
    // ═══════════════════════════════════════════════════════════════

    const REPERTORIO_DB = [
        // ─── EIXO 1: TECNOLOGIA & SOCIEDADE ───
        {
            eixo: 'Tecnologia & Sociedade',
            keywords: ['tecnologia', 'digital', 'internet', 'rede social', 'redes sociais', 'inteligência artificial', 'ia', 'privacidade', 'fake news', 'desinformação', 'algoritmo', 'celular', 'smartphone', 'whatsapp', 'instagram', 'tiktok', 'dados', 'lgpd', 'cibernético', 'hacker', 'automação', 'robô', 'virtual', 'online', 'exclusão digital', 'vício'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"1984" — George Orwell', desc: 'Distopia sobre vigilância totalitária e controle da informação pelo Estado.', uso: 'Use para temas sobre privacidade digital, manipulação de dados e vigilância algorítmica. Ex: "Assim como na ficção orwelliana, a sociedade contemporânea experimenta a vigilância constante por meio de algoritmos e cookies."', posicao: 'Desenvolvimento 1' },
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Admirável Mundo Novo" — Aldous Huxley', desc: 'Sociedade controlada pelo prazer e pela tecnologia, onde a população é alienada.', uso: 'Aplique para criticar a alienação tecnológica e o vício em entretenimento digital. Ex: "A distopia de Huxley se materializa quando jovens passam mais de 9 horas diárias conectados."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Byung-Chul Han — "Sociedade da Transparência" e "No Enxame"', desc: 'Filósofo sul-coreano critica a exposição digital, a cultura do desempenho e o esgotamento mental.', uso: 'Altamente valorizado pelos corretores do ENEM. Use na introdução ou desenvolvimento: "Para Han, a hipertransparência digital dissolve a esfera privada e transforma sujeitos em dados."', posicao: 'Introdução ou Desenvolvimento' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Guy Debord — "A Sociedade do Espetáculo"', desc: 'A imagem substitui a realidade; tudo se torna mediado por representações.', uso: 'Ideal para redes sociais e busca por validação online: "Debord já alertava que, quando o espetáculo substitui o vivido, as relações humanas se tornam encenação permanente."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Zygmunt Bauman — "Modernidade Líquida"', desc: 'Relações efêmeras, identidade fluida e vínculos frágeis na era contemporânea.', uso: 'Relacione às relações digitais superficiais: "Na modernidade líquida de Bauman, os vínculos afetivos são tão descartáveis quanto os aplicativos que os mediam."', posicao: 'Desenvolvimento 2' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"O Dilema das Redes" (Netflix, 2020)', desc: 'Documentário sobre manipulação algorítmica e vício em redes sociais.', uso: 'Use como repertório de dados e testemunho: "Como exposto em O Dilema das Redes, ex-engenheiros do Vale do Silício confirmam que algoritmos são projetados para viciar."', posicao: 'Desenvolvimento 1' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"Black Mirror" — Episódio "Nosedive" (Queda Livre)', desc: 'Sociedade distópica onde pessoas são avaliadas por notas que definem status social.', uso: 'Ideal para temas sobre julgamento social e validação virtual: "A série Black Mirror antecipa uma realidade na qual a aprovação alheia quantificada dita o valor humano."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'TIC Domicílios (CETIC.br) — Exclusão digital no Brasil', desc: 'Cerca de 30-40 milhões de brasileiros sem acesso à internet; desigualdade regional marcante.', uso: 'Fundamental para abordar exclusão digital: "Dados do CETIC.br revelam que milhões de brasileiros permanecem à margem da sociedade digital, aprofundando desigualdades socioeconômicas."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Escândalo Cambridge Analytica (2018)', desc: 'Uso indevido de dados do Facebook para manipular eleições nos EUA e no Brexit.', uso: 'Marco da crise de privacidade digital: "O escândalo Cambridge Analytica demonstrou como dados pessoais podem ser weaponizados para subverter processos democráticos."', posicao: 'Desenvolvimento 2' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'LGPD — Lei 13.709/2018 e Marco Civil da Internet', desc: 'Proteção de dados pessoais e direitos/deveres na internet brasileira.', uso: 'Essencial para proposta de intervenção: "A implementação efetiva da LGPD é imperativa para a proteção dos dados dos cidadãos brasileiros no ambiente digital."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 2: EDUCAÇÃO & CONHECIMENTO ───
        {
            eixo: 'Educação & Conhecimento',
            keywords: ['educação', 'escola', 'ensino', 'professor', 'aluno', 'estudante', 'universidade', 'analfabetismo', 'evasão', 'evasão escolar', 'ead', 'educação à distância', 'cotas', 'vestibular', 'enem', 'leitura', 'aprendizagem', 'conhecimento', 'currículo', 'pedagogia'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Pedagogia do Oprimido" — Paulo Freire', desc: 'Clássico sobre educação bancária vs. educação libertadora. O aluno não é depósito de conteúdo, mas construtor de conhecimento.', uso: 'Clássico absoluto para temas de educação: "Freire denunciou a educação bancária, que trata o aluno como receptor passivo, perpetuando a exclusão social."', posicao: 'Desenvolvimento 1' },
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Vidas Secas" — Graciliano Ramos', desc: 'Família sertaneja marginalizada, com personagens analfabetos e excluídos socialmente.', uso: 'Aplique para analfabetismo e exclusão: "Em Vidas Secas, Graciliano Ramos retrata como o analfabetismo aprisiona famílias inteiras em ciclos de pobreza e invisibilidade."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Immanuel Kant — "Sapere Aude" (Ouse saber)', desc: 'O Iluminismo como saída da menoridade intelectual; autonomia pelo conhecimento.', uso: 'Poderoso para defender acesso à educação: "Kant conclamou a humanidade a ousar saber — premissa que reforça a urgência de democratizar o acesso à educação de qualidade."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Pierre Bourdieu — Capital Cultural', desc: 'A escola reproduz desigualdades sociais ao valorizar o capital cultural das elites.', uso: 'Ideal para discutir desigualdade educacional: "Bourdieu demonstrou que a escola, ao invés de reduzir desigualdades, frequentemente as reproduz ao valorizar o capital cultural das elites."', posicao: 'Desenvolvimento 2' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"Escritores da Liberdade" (2007)', desc: 'Professora transforma alunos marginalizados por meio da escrita e da educação.', uso: 'Use para mostrar o poder transformador da educação: "Assim como no filme Escritores da Liberdade, a educação pode ser ponte entre a marginalidade e a cidadania plena."', posicao: 'Desenvolvimento 1' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'PISA (OCDE) — Avaliação internacional de educação', desc: 'Brasil consistentemente abaixo da média em leitura, matemática e ciências.', uso: 'Dado contundente: "Os resultados do PISA demonstram que o Brasil ocupa posições preocupantes em letramento e raciocínio, reflexo de investimentos insuficientes em qualidade educacional."', posicao: 'Desenvolvimento 1' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'IBGE — Taxa de analfabetismo (~5,6%, ~11 milhões)', desc: 'Persistência do analfabetismo com enormes disparidades regionais (Nordeste 3x maior que Sul).', uso: 'Use para dimensionar o problema: "Dados do IBGE revelam que cerca de 11 milhões de brasileiros são analfabetos, com concentração desproporcional nas regiões Norte e Nordeste."', posicao: 'Desenvolvimento 1' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'LDB (1996) e Lei de Cotas (12.711/2012)', desc: 'Marco legal da educação brasileira e política de democratização do ensino superior.', uso: 'Para proposta de intervenção: "A ampliação de políticas como as cotas, previstas na Lei 12.711/2012, é essencial para reduzir as disparidades de acesso ao ensino superior."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 3: MEIO AMBIENTE ───
        {
            eixo: 'Meio Ambiente & Sustentabilidade',
            keywords: ['meio ambiente', 'ambiental', 'sustentabilidade', 'sustentável', 'desmatamento', 'amazônia', 'clima', 'climática', 'aquecimento', 'global', 'poluição', 'lixo', 'reciclagem', 'plástico', 'energia', 'renovável', 'água', 'seca', 'biodiversidade', 'floresta', 'agrotóxico', 'carbono', 'emissão'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Hans Jonas — "O Princípio Responsabilidade"', desc: 'Ética da responsabilidade com as gerações futuras; ações presentes devem preservar a vida futura.', uso: 'Clássico para temas ambientais: "Hans Jonas formula o imperativo da responsabilidade: agir de modo que as consequências de nossas ações sejam compatíveis com a vida futura na Terra."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Ailton Krenak — "Ideias para Adiar o Fim do Mundo"', desc: 'Perspectiva indígena sobre a relação com a natureza e crítica ao modelo de "progresso" predatório.', uso: 'Altamente valorizado no ENEM atual: "Krenak propõe uma cosmovisão na qual a natureza não é recurso a ser explorado, mas organismo do qual fazemos parte."', posicao: 'Desenvolvimento 1' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"Uma Verdade Inconveniente" (2006)', desc: 'Documentário de Al Gore sobre aquecimento global e responsabilidade política.', uso: 'Use como evidência audiovisual: "O documentário Uma Verdade Inconveniente expôs ao mundo como a queima de combustíveis fósseis acelera o aquecimento global de forma irreversível."', posicao: 'Desenvolvimento 1' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'IPCC — Aquecimento de 1,5°C como limite crítico', desc: 'Painel Intergovernamental sobre Mudanças Climáticas projeta consequências catastróficas.', uso: 'Dado científico poderoso: "Relatórios do IPCC alertam que ultrapassar o limiar de 1,5°C de aquecimento pode desencadear eventos climáticos irreversíveis."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'INPE — Desmatamento na Amazônia', desc: 'Brasil perdeu área equivalente à Bélgica em picos recentes de desmatamento.', uso: 'Dado nacional impactante: "Dados do INPE demonstram que o Brasil perdeu área de floresta equivalente a países inteiros, comprometendo o maior bioma tropical do planeta."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Tragédias de Mariana (2015) e Brumadinho (2019)', desc: 'Desastres minerários com impacto socioambiental devastador em Minas Gerais.', uso: 'Use como exemplo concreto brasileiro: "As tragédias de Mariana e Brumadinho evidenciam a negligência corporativa e estatal na proteção ambiental e de vidas."', posicao: 'Desenvolvimento 2' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'CF Art. 225 e Acordo de Paris (2015)', desc: 'Direito ao meio ambiente equilibrado como direito fundamental + comprometimento climático de 196 países.', uso: 'Para proposta de intervenção: "O Art. 225 da Constituição garante o direito ao meio ambiente ecologicamente equilibrado — obrigação que deve nortear toda a política ambiental brasileira."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 4: DESIGUALDADE SOCIAL ───
        {
            eixo: 'Desigualdade Social & Pobreza',
            keywords: ['desigualdade', 'pobreza', 'fome', 'renda', 'social', 'pobre', 'rico', 'miséria', 'periferia', 'favela', 'racismo', 'racial', 'negro', 'preto', 'feminismo', 'mulher', 'gênero', 'lgbtqia', 'deficiência', 'migração', 'refugiado', 'moradia', 'habitação'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Quarto de Despejo" — Carolina Maria de Jesus', desc: 'Diário-relato da vida na favela paulistana; pobreza extrema e invisibilidade social narrada em primeira pessoa.', uso: 'Poderoso para desigualdade: "Carolina Maria de Jesus, em Quarto de Despejo, oferece testemunho visceral da fome e da invisibilidade dos marginalizados no Brasil."', posicao: 'Introdução' },
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Torto Arado" — Itamar Vieira Junior', desc: 'Quilombolas, trabalho análogo à escravidão e desigualdade racial no Brasil contemporâneo.', uso: 'Ideal para racismo e desigualdade rural: "Torto Arado denuncia como comunidades quilombolas permanecem subjugadas por estruturas de poder herdadas do período colonial."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'John Rawls — "Uma Teoria da Justiça"', desc: 'Princípio da diferença: desigualdades só são justas se beneficiam os menos favorecidos. Conceito do "véu da ignorância".', uso: 'Forte para defender políticas públicas: "Rawls propõe que princípios justos são aqueles escolhidos sem saber qual posição social ocuparíamos — justificativa para políticas afirmativas."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Jessé Souza — "A Elite do Atraso"', desc: 'Naturalização da desigualdade e colonização cultural no Brasil.', uso: 'Pensador brasileiro valorizado: "Para Jessé Souza, a elite brasileira naturalizou a pobreza ao longo de séculos, tornando a desigualdade invisível para os privilegiados."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'IBGE — Coeficiente de Gini (~0,53) e Oxfam', desc: 'Os 10% mais ricos detêm ~50% da renda nacional. 1% mais rico possui mais que os 50% mais pobres.', uso: 'Dado impactante: "Segundo o IBGE, a concentração de renda no Brasil é uma das piores do mundo, com os 10% mais ricos acumulando metade da riqueza nacional."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Abolição sem reparação (1888) e Bolsa Família', desc: 'Escravatura abolida sem políticas reparatórias → base do racismo estrutural. Programa Bolsa Família como tentativa de redistribuição.', uso: 'Use para historicizar a desigualdade: "A abolição sem políticas de inserção social condenou a população negra a séculos de marginalização — herança que persiste nos indicadores sociais."', posicao: 'Desenvolvimento 2' },
            ]
        },
        // ─── EIXO 5: SAÚDE PÚBLICA ───
        {
            eixo: 'Saúde Pública',
            keywords: ['saúde', 'sus', 'hospital', 'médico', 'vacina', 'pandemia', 'covid', 'doença', 'medicamento', 'remédio', 'obesidade', 'dengue', 'epidemia', 'sanitário', 'saneamento'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Michel Foucault — "Nascimento da Clínica" e Biopoder', desc: 'Medicalização e controle social através da saúde; o Estado controla corpos.', uso: 'Para temas de saúde pública: "Foucault alertou que a medicalização pode ser instrumento de controle social — reflexão pertinente para a gestão de crises sanitárias."', posicao: 'Desenvolvimento 1' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"Contágio" (Contagion, 2011)', desc: 'Filme que retrata dinâmica de pandemias e a resposta institucional global.', uso: 'Use como paralelo com COVID-19: "Assim como no filme Contágio, a pandemia de COVID-19 expôs as fragilidades dos sistemas de saúde e a desigualdade no acesso a tratamentos."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'OMS — Indicadores globais de saúde', desc: 'Depressão como principal causa de incapacidade; 1 em cada 4 pessoas terá transtorno mental.', uso: 'Dado global contundente: "A OMS estima que a depressão é a principal causa de incapacidade no mundo, afetando mais de 300 milhões de pessoas."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Criação do SUS (1988) e Pandemia COVID-19', desc: 'SUS como conquista social que atende ~75% dos brasileiros; COVID como maior crise sanitária do séc. XXI.', uso: 'Para proposta de intervenção: "O SUS, conquista da Constituição de 1988, deve ser fortalecido como política central de universalização da saúde no Brasil."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 6: DIREITOS HUMANOS ───
        {
            eixo: 'Direitos Humanos & Minorias',
            keywords: ['direitos humanos', 'minoria', 'racismo', 'feminismo', 'machismo', 'violência contra a mulher', 'feminicídio', 'lgbtqia', 'homofobia', 'transfobia', 'indígena', 'refugiado', 'preconceito', 'discriminação', 'intolerância', 'igualdade', 'equidade'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Quem tem medo do feminismo negro?" — Djamila Ribeiro', desc: 'Interseccionalidade, lugar de fala e feminismo negro no Brasil contemporâneo.', uso: 'Ideal para temas de gênero e raça: "Djamila Ribeiro expõe como opressões de gênero e raça se entrecruzam, exigindo políticas que contemplem a interseccionalidade."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Simone de Beauvoir — "O Segundo Sexo"', desc: '"Não se nasce mulher, torna-se mulher" — a construção social do gênero.', uso: 'Clássico feminista: "Beauvoir demonstrou que a condição de subalternidade feminina não é natural, mas construída socialmente — desconstrução necessária para atingir a igualdade."', posicao: 'Introdução' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'Atlas da Violência (IPEA) — Feminicídio e violência racial', desc: 'Uma mulher é morta a cada 6-8 horas; negros representam ~77% das vítimas de homicídio.', uso: 'Dado chocante: "O Atlas da Violência do IPEA revela que uma mulher é assassinada a cada 6 horas no Brasil — emergência que exige ação imediata do poder público."', posicao: 'Desenvolvimento 1' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'Lei Maria da Penha (2006), Lei do Feminicídio (2015) e DUDH', desc: 'Combate à violência doméstica, tipificação do feminicídio e Declaração Universal dos Direitos Humanos.', uso: 'Para proposta de intervenção: "A efetivação da Lei Maria da Penha deve ser acompanhada de políticas preventivas, como educação de gênero nas escolas."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 7: VIOLÊNCIA & SEGURANÇA ───
        {
            eixo: 'Violência & Segurança Pública',
            keywords: ['violência', 'segurança', 'crime', 'tráfico', 'droga', 'prisão', 'preso', 'cárcere', 'policial', 'homicídio', 'arma', 'bullying', 'assédio'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Cidade de Deus" — Paulo Lins', desc: 'Narrativa sobre o tráfico de drogas e a violência nas favelas do Rio de Janeiro.', uso: 'Retrato da violência urbana: "Em Cidade de Deus, Paulo Lins expõe como a ausência do Estado em periferias gera um vácuo de poder ocupado pela criminalidade."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Thomas Hobbes — "Leviatã"', desc: 'Estado de natureza como "guerra de todos contra todos"; o Estado como garantidor da ordem.', uso: 'Fundamentação clássica: "Hobbes demonstrou que, sem a atuação efetiva do Estado, a vida seria solitária, pobre e brutal — realidade vivida em áreas desassistidas do Brasil."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Michel Foucault — "Vigiar e Punir"', desc: 'Sistema penal, punição e mecanismos de controle social.', uso: 'Para sistema prisional: "Foucault questionou se o sistema penal reabilita ou apenas perpetua ciclos de exclusão e violência — pergunta central diante da superlotação carcerária brasileira."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'INFOPEN e Anuário de Segurança Pública (FBSP)', desc: 'Brasil tem 3ª maior população carcerária do mundo (~900 mil), com superlotação de ~70%.', uso: 'Dado alarmante: "O Brasil possui a terceira maior população carcerária do planeta, com superlotação que inviabiliza qualquer projeto de ressocialização."', posicao: 'Desenvolvimento 2' },
            ]
        },
        // ─── EIXO 8: DEMOCRACIA & CIDADANIA ───
        {
            eixo: 'Democracia, Política & Cidadania',
            keywords: ['democracia', 'política', 'cidadania', 'cidadão', 'voto', 'eleição', 'governo', 'corrupção', 'polarização', 'autoritarismo', 'ditadura', 'constituição', 'participação', 'representatividade', 'registro civil'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Hannah Arendt — "Origens do Totalitarismo"', desc: 'Como democracias podem colapsar em regimes autoritários; banalidade do mal.', uso: 'Poderoso para defender a democracia: "Arendt demonstrou que o mal não requer monstruosidade — basta a ausência de pensamento crítico e a submissão acrítica."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Norberto Bobbio — "O Futuro da Democracia"', desc: 'Regras do jogo democrático e seus desafios contemporâneos.', uso: 'Para temas de participação política: "Bobbio alertou que a democracia se enfraquece quando os cidadãos deixam de participar ativamente das decisões coletivas."', posicao: 'Desenvolvimento 1' },
                { cat: '🎬 Cinema', icon: 'ph-film-strip', title: '"Democracia em Vertigem" (Netflix, 2019)', desc: 'Documentário sobre a crise política brasileira contemporânea (Petra Costa).', uso: 'Repertório audiovisual sobre política brasileira: "O documentário Democracia em Vertigem retrata como crises políticas podem ameaçar conquistas democráticas construídas ao longo de décadas."', posicao: 'Desenvolvimento 2' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Ditadura Militar (1964-1985) e Constituição de 1988', desc: 'Período de supressão de direitos vs. "Constituição Cidadã" que restaurou a democracia.', uso: 'Contextualização histórica: "A Constituição de 1988, nascida após 21 anos de ditadura, consagrou direitos fundamentais que devem ser permanentemente protegidos."', posicao: 'Introdução' },
            ]
        },
        // ─── EIXO 9: CULTURA & IDENTIDADE ───
        {
            eixo: 'Cultura, Identidade & Arte',
            keywords: ['cultura', 'identidade', 'arte', 'patrimônio', 'museu', 'música', 'língua', 'diversidade cultural', 'tradição', 'modernismo', 'literatura', 'cinema brasileiro'],
            items: [
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Macunaíma" — Mário de Andrade', desc: 'Herói sem caráter que representa a identidade nacional multifacetada e contraditória.', uso: 'Para identidade cultural: "Mário de Andrade, em Macunaíma, sintetizou a complexidade da identidade brasileira — plural, híbrida e resistente a definições únicas."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Stuart Hall — "A Identidade Cultural na Pós-Modernidade"', desc: 'Identidades fragmentadas e híbridas no mundo globalizado; não há identidade fixa.', uso: 'Use para temas de globalização e identidade: "Stuart Hall teorizou que, na pós-modernidade, as identidades são construções dinâmicas e múltiplas — não essências fixas."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Semana de Arte Moderna (1922) e Incêndio do Museu Nacional (2018)', desc: 'Ruptura artístico-cultural e perda de patrimônio histórico inestimável.', uso: 'Para preservação cultural: "O incêndio do Museu Nacional em 2018 revelou o descaso do Estado com o patrimônio cultural — perda irreparável de 200 anos de história."', posicao: 'Desenvolvimento 2' },
            ]
        },
        // ─── EIXO 10: TRABALHO & ECONOMIA ───
        {
            eixo: 'Trabalho & Economia',
            keywords: ['trabalho', 'emprego', 'desemprego', 'economia', 'salário', 'renda', 'trabalhador', 'informalidade', 'uberização', 'precarização', 'reforma trabalhista', 'escravidão', 'clt', 'automação'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Karl Marx — Alienação do trabalho e mais-valia', desc: 'O trabalhador é alienado do produto de seu trabalho no capitalismo; exploração sistêmica.', uso: 'Para desigualdade trabalhista: "Marx demonstrou que a alienação do trabalho reduz o ser humano a engrenagem do sistema produtivo, fenômeno intensificado pela uberização contemporânea."', posicao: 'Desenvolvimento 1' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Richard Sennett — "A Corrosão do Caráter"', desc: 'Impacto do trabalho flexível e precarizado na identidade e dignidade do trabalhador.', uso: 'Para trabalho precarizado: "Sennett analisa como o trabalho flexível corrói a identidade do trabalhador, produzindo ansiedade e insegurança permanentes."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'IBGE — Informalidade (~40%) e desigualdade salarial', desc: '40% dos trabalhadores na informalidade; mulheres recebem 20-30% menos; negros 40-50% menos.', uso: 'Dado estrutural: "Dados do IBGE revelam que cerca de 40% dos trabalhadores brasileiros vivem na informalidade, sem acesso a direitos trabalhistas básicos."', posicao: 'Desenvolvimento 1' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'CLT (1943) e Reforma Trabalhista (2017)', desc: 'Marco histórico da legislação trabalhista vs. flexibilização recente das relações de trabalho.', uso: 'Para proposta de intervenção: "O fortalecimento da proteção trabalhista, em consonância com os princípios da CLT, é essencial para conter a precarização crescente."', posicao: 'Conclusão' },
            ]
        },
        // ─── EIXO 11: SAÚDE MENTAL ───
        {
            eixo: 'Saúde Mental & Bem-Estar',
            keywords: ['saúde mental', 'depressão', 'ansiedade', 'suicídio', 'burnout', 'cansaço', 'esgotamento', 'solidão', 'autoestima', 'psicológico', 'terapia', 'psicologia'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Byung-Chul Han — "A Sociedade do Cansaço"', desc: 'Excesso de positividade e autoexploração geram esgotamento mental; o sujeito é algoz de si mesmo.', uso: 'Extremamente citado no ENEM: "Han revela que o sujeito contemporâneo não é explorado por um outro, mas por si mesmo — autoexploração que culmina em burnout e depressão."', posicao: 'Introdução' },
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Viktor Frankl — "Em Busca de Sentido"', desc: 'Sobrevivente de Auschwitz; defende que o sentido de vida é proteção contra o sofrimento.', uso: 'Poderoso para saúde mental: "Frankl demonstrou que, mesmo nas piores condições, a busca por sentido de vida protege o ser humano do colapso psíquico."', posicao: 'Desenvolvimento 2' },
                { cat: '🔬 Dados', icon: 'ph-chart-bar', title: 'OMS — Ansiedade e depressão no Brasil', desc: 'Brasil tem a maior taxa de ansiedade do mundo proporcionalmente; depressão atinge ~12 milhões.', uso: 'Dado alarmante: "A OMS posiciona o Brasil como o país mais ansioso do mundo, com ~12 milhões de pessoas diagnosticadas com depressão — crise silenciosa que demanda ação urgente."', posicao: 'Desenvolvimento 1' },
                { cat: '📰 Fatos Históricos', icon: 'ph-newspaper', title: 'Burnout como doença ocupacional (OMS/CID-11, 2022)', desc: 'Reconhecimento oficial da síndrome de esgotamento profissional pela OMS.', uso: 'Para legitimação do tema: "A inclusão do burnout na CID-11 pela OMS em 2022 oficializou o que trabalhadores já vivenciavam — o adoecimento pelo excesso de trabalho é uma epidemia moderna."', posicao: 'Desenvolvimento 2' },
            ]
        },
        // ─── EIXO 12: FAMÍLIA & RELAÇÕES ───
        {
            eixo: 'Família & Relações Sociais',
            keywords: ['família', 'relação', 'casamento', 'divórcio', 'adoção', 'criança', 'adolescente', 'idoso', 'envelhecimento', 'abuso', 'violência doméstica', 'abandono'],
            items: [
                { cat: '🧠 Filosofia', icon: 'ph-brain', title: 'Zygmunt Bauman — "Amor Líquido"', desc: 'Vínculos afetivos frágeis na modernidade líquida; relações descartáveis como objetos de consumo.', uso: 'Para relações sociais: "Bauman denuncia que, na modernidade líquida, as relações humanas se tornam descartáveis — fenômeno acelerado pelos aplicativos de relacionamento."', posicao: 'Introdução' },
                { cat: '📚 Literatura', icon: 'ph-book-open', title: '"Dom Casmurro" — Machado de Assis', desc: 'Ciúme, traição e desconfiança dissolvem os laços familiares no Brasil do séc. XIX.', uso: 'Para dissolução familiar: "Machado de Assis, em Dom Casmurro, magistralmente expõe como a desconfiança corrói vínculos — dinâmica que persiste nas famílias contemporâneas."', posicao: 'Desenvolvimento 1' },
                { cat: '⚖️ Legislação', icon: 'ph-scales', title: 'ECA (1990) e Estatuto do Idoso (2003)', desc: 'Proteção integral de crianças/adolescentes e direitos das pessoas com mais de 60 anos.', uso: 'Para proposta de intervenção: "A efetivação do Estatuto da Criança e do Adolescente é imperativa para proteger menores em situação de vulnerabilidade familiar."', posicao: 'Conclusão' },
            ]
        },
    ];

    // ─── Motor de busca de repertório ───
    function searchRepertorio(theme) {
        const themeLower = theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const themeWords = themeLower.split(/\s+/).filter(w => w.length > 2);

        // Pontuar cada eixo por relevância
        const scoredEixos = REPERTORIO_DB.map(eixo => {
            let score = 0;
            const normalizedKeywords = eixo.keywords.map(k => k.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

            for (const keyword of normalizedKeywords) {
                if (themeLower.includes(keyword)) {
                    score += 10; // match direto
                } else {
                    for (const word of themeWords) {
                        if (keyword.includes(word) || word.includes(keyword)) {
                            score += 3;
                        }
                    }
                }
            }

            // Bonus: verificar se título dos itens contêm palavras do tema
            for (const item of eixo.items) {
                const titleNorm = item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                for (const word of themeWords) {
                    if (titleNorm.includes(word)) score += 2;
                }
            }

            return { ...eixo, score };
        }).filter(e => e.score > 0).sort((a, b) => b.score - a.score);

        // Pegar top 3 eixos mais relevantes
        const topEixos = scoredEixos.slice(0, 3);

        if (topEixos.length === 0) {
            // Fallback: retornar eixos universais (desigualdade + educação + tecnologia)
            return REPERTORIO_DB.filter(e =>
                ['Desigualdade Social & Pobreza', 'Educação & Conhecimento', 'Tecnologia & Sociedade'].includes(e.eixo)
            );
        }

        return topEixos;
    }

    function renderRepertorio(eixos, theme) {
        let html = `
        <div class="repertorio-header">
            <h3>📖 Repertório Sociocultural — "${theme}"</h3>
            <p class="repertorio-tip">💡 <strong>Dica estratégica:</strong> Use repertórios de pelo menos 3 categorias diferentes (filosofia + dados + literatura) para maximizar a nota na Competência II. O repertório deve ser articulado ao argumento, não apenas citado.</p>
        </div>
    `;

        // Top 3 indicadores
        const allItems = eixos.flatMap(e => e.items);
        const top3 = allItems.slice(0, 3);
        html += `
        <div class="repertorio-top3">
            <h4>🏆 Top 3 Repertórios para Este Tema</h4>
            <ol>
                ${top3.map((item, i) => `<li><strong>${item.title}</strong> — ${item.cat} | Melhor em: ${item.posicao}</li>`).join('')}
            </ol>
        </div>
    `;

        // Por eixo e categoria
        for (const eixo of eixos) {
            html += `<div class="repertorio-eixo-title"><i class="ph ph-stack"></i> ${eixo.eixo}</div>`;

            for (const item of eixo.items) {
                html += `
                <div class="repertorio-item">
                    <span class="r-badge"><i class="ph ${item.icon}"></i> ${item.cat}</span>
                    <span class="r-position-badge">${item.posicao}</span>
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    <div class="r-tip"><strong>✍️ Como usar na redação:</strong> ${item.uso}</div>
                </div>
            `;
            }
        }

        // Frases prontas
        html += `
        <div class="repertorio-frases">
            <h4>⚡ Frases-modelo para Introduzir Repertório</h4>
            <ul>
                <li>"Conforme apontado por <em>[autor/estudo]</em>, <em>[ideia central]</em>..."</li>
                <li>"O filósofo <em>[nome]</em> já alertava que <em>[conceito aplicado ao tema]</em>..."</li>
                <li>"Segundo dados do <em>[instituto]</em>, <em>[dado + interpretação]</em>..."</li>
                <li>"O <em>[filme/livro]</em> '<em>[título]</em>' ilustra como <em>[relação com o tema]</em>..."</li>
                <li>"O art. <em>[X]</em> da <em>[lei]</em> determina que <em>[relação com o tema]</em>..."</li>
            </ul>
        </div>
    `;

        return html;
    }

    // ─── Event listeners do repertório ───
    function initRepertoire() {
        const btnSearchRepertorio = document.getElementById('btn-search-repertorio');
        const inputRepertorio = document.getElementById('repertorio-search');
        const resultsContainer = document.getElementById('repertorio-results');

        if (btnSearchRepertorio) {
            btnSearchRepertorio.addEventListener('click', () => {
                const theme = inputRepertorio.value.trim();
                if (!theme) return;

                resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="ph ph-spinner-gap spinner-icon"></i>
                    <p>Buscando as melhores referências para "${theme}"...</p>
                </div>
            `;

                setTimeout(() => {
                    const eixos = searchRepertorio(theme);
                    resultsContainer.innerHTML = renderRepertorio(eixos, theme);
                }, 800);
            });

            inputRepertorio.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    btnSearchRepertorio.click();
                }
            });
        }
    }

    window.RedacaoPro.Repertoire = { initRepertoire };
})();
