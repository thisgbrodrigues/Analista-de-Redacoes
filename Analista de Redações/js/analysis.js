// ═══════════════════════════════════════════════
// === MOTOR DE ANÁLISE HEURÍSTICA (C1-C5) =====
// ═══════════════════════════════════════════════

(function () {
    // --- Listas de referência para análise ---
    const CONECTIVOS_ADICAO = ['além disso', 'ademais', 'outrossim', 'não apenas', 'mas também', 'bem como', 'e também', 'acrescenta-se', 'soma-se a isso', 'paralelamente'];
    const CONECTIVOS_OPOSICAO = ['entretanto', 'todavia', 'contudo', 'no entanto', 'embora', 'apesar de', 'porém', 'não obstante', 'diferentemente', 'em contrapartida'];
    const CONECTIVOS_CAUSA = ['portanto', 'logo', 'assim', 'dessa forma', 'visto que', 'uma vez que', 'dado que', 'por causa de', 'em virtude de', 'em razão de', 'por conseguinte', 'consequentemente'];
    const CONECTIVOS_EXPLICACAO = ['ou seja', 'isto é', 'a saber', 'em outras palavras', 'quer dizer'];
    const CONECTIVOS_CONCLUSAO = ['diante do exposto', 'em suma', 'conclui-se que', 'nota-se portanto', 'portanto', 'dessa maneira', 'nesse sentido'];
    const CONECTIVOS_TODOS = [...CONECTIVOS_ADICAO, ...CONECTIVOS_OPOSICAO, ...CONECTIVOS_CAUSA, ...CONECTIVOS_EXPLICACAO, ...CONECTIVOS_CONCLUSAO];

    const PALAVRAS_REPERTORIO = [
        'segundo', 'conforme', 'de acordo com', 'para o filósofo', 'para o sociólogo',
        'como afirma', 'como aponta', 'como destaca', 'como defende',
        'na obra', 'no livro', 'no filme', 'na série', 'constituição federal',
        'ibge', 'oms', 'onu', 'ipea', 'inep', 'pnud',
        'pesquisa', 'estudo', 'dados', 'estatístic', 'levantamento',
        'lei', 'decreto', 'artigo', 'código', 'carta magna',
        'filósofo', 'sociólogo', 'historiador', 'pensador', 'teórico',
        'bourdieu', 'foucault', 'freire', 'bauman', 'marx', 'kant', 'sartre',
        'hannah arendt', 'habermas', 'durkheim', 'weber', 'byung-chul han',
        'portinari', 'graciliano', 'machado de assis', 'drummond',
    ];

    const PALAVRAS_INTERVENCAO_AGENTE = [
        'governo', 'estado', 'ministério', 'poder público', 'congresso',
        'prefeitura', 'secretaria', 'órgão', 'poder executivo', 'poder legislativo',
        'escola', 'universidade', 'mídia', 'imprensa', 'ong',
        'sociedade civil', 'setor privado', 'empresas',
    ];

    const PALAVRAS_INTERVENCAO_ACAO = [
        'deve', 'devem', 'é necessário', 'faz-se necessário', 'urge',
        'cabe ao', 'cabe à', 'é preciso', 'é fundamental', 'é imprescindível',
        'implementar', 'criar', 'promover', 'desenvolver', 'garantir', 'assegurar',
        'estabelecer', 'propiciar', 'fomentar', 'viabilizar',
    ];

    const PALAVRAS_INTERVENCAO_MEIO = [
        'por meio de', 'através de', 'mediante', 'por intermédio de',
        'com base em', 'a partir de',
    ];

    const PALAVRAS_INTERVENCAO_FINALIDADE = [
        'a fim de', 'para que', 'com o objetivo de', 'com o intuito de',
        'visando', 'com a finalidade de', 'de modo que', 'de forma que',
        'para garantir', 'para assegurar', 'para promover',
    ];

    const GIRIAS_COLOQUIALISMOS = [
        'tipo assim', 'né', 'aí', 'daí', 'pra', 'pro', 'tá', 'tô',
        'vc', 'mano', 'cara', 'galera', 'gente', 'show', 'top',
        'zoar', 'zueira', 'massa', 'firmeza', 'tranquilo',
    ];

    // --- Funções utilitárias ---
    function countOccurrences(text, terms) {
        const lower = text.toLowerCase();
        let count = 0;
        const found = [];
        terms.forEach(term => {
            const regex = new RegExp(term.toLowerCase(), 'gi');
            const matches = lower.match(regex);
            if (matches) {
                count += matches.length;
                found.push(term);
            }
        });
        return { count, found };
    }

    function countParagraphs(text) {
        return text.split(/\n+/).filter(p => p.trim().length > 15).length;
    }

    function countSentences(text) {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
    }

    function countWords(text) {
        return text.split(/\s+/).filter(w => w.length > 0).length;
    }

    function getUniqueWords(text) {
        const words = text.toLowerCase().replace(/[^a-záàãâéêíóôõúüç\s]/gi, '').split(/\s+/).filter(w => w.length > 3);
        return new Set(words);
    }

    function clampScore(score) {
        // Notas possíveis: 0, 40, 80, 120, 160, 200
        const levels = [0, 40, 80, 120, 160, 200];
        let closest = 0;
        let minDiff = Infinity;
        for (const lvl of levels) {
            const diff = Math.abs(score - lvl);
            if (diff < minDiff) { minDiff = diff; closest = lvl; }
        }
        return closest;
    }

    function getLevelLabel(score) {
        const labels = {
            0: 'Nível 0 — Desconhecimento',
            40: 'Nível 1 — Precário',
            80: 'Nível 2 — Insuficiente',
            120: 'Nível 3 — Mediano',
            160: 'Nível 4 — Bom',
            200: 'Nível 5 — Excelente',
        };
        return labels[score] || `Nível ${score / 40}`;
    }

    // ═══════════════════════════════════════════════
    // === ANÁLISE POR COMPETÊNCIA ==================
    // ═══════════════════════════════════════════════

    function analyzeC1(text) {
        let rawScore = 180;
        const feedback = [];
        const improvements = [];

        const wordCount = countWords(text);
        const sentences = countSentences(text);
        const avgWordsPerSentence = wordCount / Math.max(sentences, 1);

        // Verificar gírias e coloquialismos
        const { count: giriasCount, found: giriasFound } = countOccurrences(text, GIRIAS_COLOQUIALISMOS);
        if (giriasCount > 0) {
            rawScore -= giriasCount * 25;
            feedback.push(`Encontrado uso de linguagem informal/coloquial: "${giriasFound.join('", "')}". Em uma dissertação formal do ENEM, esses termos penalizam significativamente.`);
            improvements.push('Elimine todas as gírias e expressões coloquiais. Substitua por equivalentes formais (ex: "pra" → "para", "aí" → "nesse contexto").');
        }

        // Verificar frases muito curtas (< 5 palavras) ou muito longas (> 50 palavras)
        const sentenceTexts = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let shortSentences = 0;
        let longSentences = 0;
        sentenceTexts.forEach(s => {
            const wc = countWords(s.trim());
            if (wc < 5 && wc > 0) shortSentences++;
            if (wc > 50) longSentences++;
        });

        if (shortSentences > 2) {
            rawScore -= 15;
            feedback.push(`Foram encontradas ${shortSentences} frases muito curtas (menos de 5 palavras). Frases muito curtas podem comprometer a articulação das ideias.`);
            improvements.push('Desenvolva melhor suas frases, evitando períodos excessivamente curtos que fragmentam o raciocínio.');
        }

        if (longSentences > 2) {
            rawScore -= 15;
            feedback.push(`Foram encontradas ${longSentences} frases excessivamente longas (mais de 50 palavras). Períodos muito longos podem causar confusão e erros de concordância.`);
            improvements.push('Quebre períodos muito longos em frases menores e mais claras, sem perder a coesão.');
        }

        // Diversidade vocabular
        const uniqueWords = getUniqueWords(text);
        const diversityRatio = uniqueWords.size / Math.max(wordCount, 1);
        if (diversityRatio < 0.35) {
            rawScore -= 20;
            feedback.push(`Diversidade vocabular abaixo do ideal (${(diversityRatio * 100).toFixed(0)}%). Há muita repetição de palavras.`);
            improvements.push('Amplie seu vocabulário usando sinônimos, hiperônimos e substituição lexical para evitar repetições.');
        } else if (diversityRatio > 0.50) {
            feedback.push('Boa diversidade vocabular — vocabulário variado e adequado ao registro formal.');
        }

        // Verificar repetição excessiva de palavras
        const wordFreq = {};
        text.toLowerCase().replace(/[^a-záàãâéêíóôõúüç\s]/gi, '').split(/\s+/).filter(w => w.length > 4).forEach(w => {
            wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
        const repeatedWords = Object.entries(wordFreq).filter(([, count]) => count > 5);
        if (repeatedWords.length > 0) {
            rawScore -= repeatedWords.length * 8;
            const words = repeatedWords.map(([w, c]) => `"${w}" (${c}x)`).join(', ');
            feedback.push(`Palavras com repetição excessiva: ${words}. Usar sinônimos e referenciação para evitar repetições.`);
            improvements.push('Utilize pronomes, sinônimos e expressões equivalentes para substituir palavras repetidas (referenciação).');
        }

        // Verificar pontuação básica
        const exclamacoes = (text.match(/!/g) || []).length;
        if (exclamacoes > 2) {
            rawScore -= 10;
            feedback.push(`Uso excessivo de pontos de exclamação (${exclamacoes}). Na dissertação-argumentativa, o tom deve ser assertivo mas sem excessos emocionais.`);
            improvements.push('Reduza o uso de exclamações. O tom dissertativo pede afirmações diretas, não emotivas.');
        }

        // Texto muito curto
        if (wordCount < 100) {
            rawScore -= 60;
            feedback.push(`Texto com apenas ${wordCount} palavras — abaixo do mínimo esperado para uma redação do ENEM (mínimo ~200 palavras / 7 linhas).`);
            improvements.push('Desenvolva mais seus argumentos. Uma redação do ENEM deve ter entre 200 e 400 palavras (7 a 30 linhas).');
        } else if (wordCount < 200) {
            rawScore -= 30;
            feedback.push(`Texto com ${wordCount} palavras — ainda abaixo do recomendado. Isso pode limitar o desenvolvimento dos argumentos.`);
            improvements.push('Amplie seus parágrafos de desenvolvimento com mais exemplos e explicações.');
        }

        if (feedback.length === 0) {
            feedback.push('Bom domínio da norma culta. O texto apresenta registro formal adequado, sem desvios graves de gramática ou convenções da escrita.');
        }

        const score = clampScore(Math.max(0, rawScore));

        if (score < 200) {
            improvements.push('Para nota máxima: revise concordância verbal/nominal, regência, ortografia e pontuação. Desvios devem ser raros e não reincidentes.');
        }

        return { score, feedback, improvements };
    }

    function analyzeC2(text) {
        let rawScore = 100;
        const feedback = [];
        const improvements = [];

        const paragraphs = countParagraphs(text);
        const wordCount = countWords(text);

        // Estrutura dissertativa: introdução + desenvolvimento + conclusão (min 4 parágrafos)
        if (paragraphs >= 4) {
            rawScore += 40;
            feedback.push(`Estrutura dissertativa adequada: ${paragraphs} parágrafos identificados (introdução, desenvolvimentos e conclusão).`);
        } else if (paragraphs === 3) {
            rawScore += 20;
            feedback.push(`Estrutura com ${paragraphs} parágrafos — aceitável, mas o ideal são 4 parágrafos (intro + 2 desenvolvimentos + conclusão).`);
            improvements.push('Divida seus argumentos em 2 parágrafos de desenvolvimento distintos para melhor organização.');
        } else if (paragraphs <= 2) {
            rawScore -= 20;
            feedback.push(`Apenas ${paragraphs} parágrafo(s) identificado(s). A dissertação-argumentativa do ENEM exige no mínimo 4 parágrafos.`);
            improvements.push('Estruture seu texto em: Introdução → Desenvolvimento 1 → Desenvolvimento 2 → Conclusão com proposta de intervenção.');
        }

        // Repertório sociocultural
        const { count: repCount, found: repFound } = countOccurrences(text, PALAVRAS_REPERTORIO);
        if (repCount >= 4) {
            rawScore += 40;
            feedback.push(`Excelente uso de repertório sociocultural (${repCount} referências detectadas). Elementos encontrados: ${repFound.slice(0, 6).join(', ')}.`);
        } else if (repCount >= 2) {
            rawScore += 20;
            feedback.push(`Repertório sociocultural presente, mas poderia ser mais diversificado (${repCount} referências). Detectado: ${repFound.join(', ')}.`);
            improvements.push('Adicione mais referências socioculturais: cite filósofos, dados estatísticos, obras literárias ou fatos históricos de forma articulada ao seu argumento.');
        } else if (repCount === 1) {
            rawScore -= 10;
            feedback.push('Repertório sociocultural insuficiente. Apenas uma referência detectada. A C2 exige repertório produtivo e bem articulado.');
            improvements.push('Inclua ao menos 2-3 referências socioculturais produtivas: dados (IBGE, OMS), pensadores (Foucault, Bauman), obras literárias, leis (CF/88).');
        } else {
            rawScore -= 40;
            feedback.push('Nenhum repertório sociocultural identificado. Sem fundamentação externa, a argumentação se torna "previsível" (máximo nível 3 segundo INEP).');
            improvements.push('PRIORIDADE ALTA: Inclua repertório sociocultural produtivo — filósofos, dados, obras literárias, legislação. Ele deve ser pertinente e articulado ao argumento, não decorativo.');
        }

        // Texto muito curto indica tangenciamento ou falta de desenvolvimento
        if (wordCount < 150) {
            rawScore -= 30;
            improvements.push('Desenvolva mais o tema. Textos curtos indicam falta de aprofundamento na temática proposta.');
        }

        const score = clampScore(Math.max(0, rawScore));
        if (score < 200) {
            improvements.push('Para nota máxima: apresente repertório variado (dados, filósofos, obras literárias), bem articulado ao argumento, e demonstre excelente domínio da estrutura dissertativo-argumentativa.');
        }

        return { score, feedback, improvements };
    }

    function analyzeC3(text) {
        let rawScore = 120;
        const feedback = [];
        const improvements = [];

        const paragraphs = countParagraphs(text);
        const wordCount = countWords(text);
        const paragraphTexts = text.split(/\n+/).filter(p => p.trim().length > 15);

        // Verificar progressão temática: cada parágrafo deve ter tamanho razoável
        if (paragraphs >= 4) {
            const lengths = paragraphTexts.map(p => countWords(p));
            const balanced = lengths.every(l => l > 30);
            if (balanced) {
                rawScore += 40;
                feedback.push('Boa organização: parágrafos bem desenvolvidos com extensão adequada, indicando progressão temática.');
            } else {
                rawScore += 15;
                feedback.push('Alguns parágrafos estão pouco desenvolvidos (menos de 30 palavras). Cada parágrafo precisa ter argumentação suficiente.');
                improvements.push('Desenvolva todos os parágrafos com no mínimo 4-5 frases cada. Parágrafos pequenos indicam argumentação superficial.');
            }
        } else {
            rawScore -= 20;
            feedback.push('Estrutura insuficiente para boa progressão temática. Poucos parágrafos limitam a organização das ideias.');
            improvements.push('Organize o texto em pelo menos 4 parágrafos com progressão clara: introdução → argumento 1 → argumento 2 → conclusão.');
        }

        // Verificar se há tese na introdução (primeiro parágrafo)
        if (paragraphTexts.length > 0) {
            const intro = paragraphTexts[0].toLowerCase();
            const hasTese = intro.length > 80 && countWords(paragraphTexts[0]) > 20;
            if (hasTese) {
                rawScore += 15;
                feedback.push('Introdução com extensão adequada, indicando contextualização e possível tese.');
            } else {
                rawScore -= 10;
                feedback.push('Introdução curta demais — pode não estar apresentando adequadamente o tema e a tese.');
                improvements.push('Na introdução, contextualize o tema de forma ampla e finalize com uma tese clara e bem delimitada.');
            }
        }

        // Verificar se conclusão existe e tem proposta
        if (paragraphTexts.length > 2) {
            const lastParagraph = paragraphTexts[paragraphTexts.length - 1].toLowerCase();
            const hasConclusionMarker = CONECTIVOS_CONCLUSAO.some(c => lastParagraph.includes(c)) ||
                lastParagraph.includes('portanto') || lastParagraph.includes('dessa forma') ||
                lastParagraph.includes('nota-se') || lastParagraph.includes('conclui-se');
            if (hasConclusionMarker) {
                rawScore += 15;
                feedback.push('Conclusão identificada com marcador adequado, indicando fechamento do texto.');
            } else {
                improvements.push('Inicie a conclusão com conectivos conclusivos: "Portanto", "Diante do exposto", "Em suma", para marcar claramente o fechamento.');
            }
        }

        // Diversidade de ideias (verificar se parágrafos não repetem demais)
        if (paragraphTexts.length >= 3) {
            const paraWords = paragraphTexts.map(p => new Set(p.toLowerCase().split(/\s+/).filter(w => w.length > 4)));
            let totalOverlap = 0;
            let comparisons = 0;
            for (let i = 0; i < paraWords.length; i++) {
                for (let j = i + 1; j < paraWords.length; j++) {
                    let overlap = 0;
                    paraWords[i].forEach(w => { if (paraWords[j].has(w)) overlap++; });
                    const overlapRatio = overlap / Math.max(Math.min(paraWords[i].size, paraWords[j].size), 1);
                    totalOverlap += overlapRatio;
                    comparisons++;
                }
            }
            const avgOverlap = totalOverlap / Math.max(comparisons, 1);
            if (avgOverlap > 0.5) {
                rawScore -= 20;
                feedback.push('Alta repetição de ideias entre parágrafos. Cada parágrafo deve desenvolver um argumento diferente.');
                improvements.push('Evite repetir os mesmos argumentos em parágrafos diferentes. Cada parágrafo de desenvolvimento deve trazer um novo eixo argumentativo.');
            }
        }

        const score = clampScore(Math.max(0, rawScore));
        if (score < 200) {
            improvements.push('Para nota máxima: apresente projeto de texto estratégico com tese clara na introdução, dois argumentos complementares (não repetidos) no desenvolvimento, e conclusão coerente com o diagnóstico.');
        }

        return { score, feedback, improvements };
    }

    function analyzeC4(text) {
        let rawScore = 80;
        const feedback = [];
        const improvements = [];

        const textLower = text.toLowerCase();

        // Contar conectivos por categoria
        const adicao = countOccurrences(textLower, CONECTIVOS_ADICAO);
        const oposicao = countOccurrences(textLower, CONECTIVOS_OPOSICAO);
        const causa = countOccurrences(textLower, CONECTIVOS_CAUSA);
        const explicacao = countOccurrences(textLower, CONECTIVOS_EXPLICACAO);
        const conclusao = countOccurrences(textLower, CONECTIVOS_CONCLUSAO);

        const totalConectivos = adicao.count + oposicao.count + causa.count + explicacao.count + conclusao.count;
        const categoriesUsed = [adicao, oposicao, causa, explicacao, conclusao].filter(c => c.count > 0).length;

        // Calcular pontuação baseada na quantidade e diversidade
        if (totalConectivos >= 8 && categoriesUsed >= 4) {
            rawScore = 190;
            feedback.push(`Excelente repertório de recursos coesivos: ${totalConectivos} conectivos encontrados em ${categoriesUsed} categorias diferentes.`);
        } else if (totalConectivos >= 5 && categoriesUsed >= 3) {
            rawScore = 155;
            feedback.push(`Bom repertório coesivo: ${totalConectivos} conectivos em ${categoriesUsed} categorias.`);
        } else if (totalConectivos >= 3 && categoriesUsed >= 2) {
            rawScore = 115;
            feedback.push(`Repertório coesivo mediano: ${totalConectivos} conectivos em ${categoriesUsed} categorias. Falta diversificação.`);
        } else if (totalConectivos >= 1) {
            rawScore = 75;
            feedback.push(`Repertório coesivo insuficiente: apenas ${totalConectivos} conectivo(s) identificado(s). A articulação do texto está comprometida.`);
        } else {
            rawScore = 35;
            feedback.push('Nenhum conectivo argumentativo identificado. O texto não apresenta articulação adequada entre partes.');
        }

        // Listar os conectivos encontrados
        const allFound = [...adicao.found, ...oposicao.found, ...causa.found, ...explicacao.found, ...conclusao.found];
        if (allFound.length > 0) {
            feedback.push(`Conectivos encontrados: "${allFound.join('", "')}".`);
        }

        // Sugestões específicas por categoria ausente
        if (adicao.count === 0) improvements.push('Adicione conectivos de adição: "além disso", "ademais", "outrossim", "não apenas... mas também".');
        if (oposicao.count === 0) improvements.push('Adicione conectivos de oposição: "entretanto", "todavia", "contudo", "no entanto", "apesar de".');
        if (causa.count === 0) improvements.push('Adicione conectivos de causa/consequência: "visto que", "uma vez que", "portanto", "por conseguinte".');
        if (conclusao.count === 0) improvements.push('Adicione conectivos conclusivos: "diante do exposto", "conclui-se que", "em suma".');

        // Verificar repetição do mesmo conectivo
        const conectivoFreq = {};
        allFound.forEach(c => { conectivoFreq[c] = (conectivoFreq[c] || 0) + 1; });
        const repeated = Object.entries(conectivoFreq).filter(([, count]) => count > 2);
        if (repeated.length > 0) {
            rawScore -= 15;
            const list = repeated.map(([c, n]) => `"${c}" (${n}x)`).join(', ');
            feedback.push(`Conectivo(s) repetido(s): ${list}. A diversidade é tão importante quanto a quantidade.`);
            improvements.push('Varie seus conectivos — evite repetir o mesmo várias vezes. Cada ocorrência deve usar um recurso coesivo diferente quando possível.');
        }

        const score = clampScore(Math.max(0, rawScore));
        if (score < 200) {
            improvements.push('Para nota máxima: use repertório diversificado de conectivos (adição, oposição, causa, conclusão, explicação) sem inadequações nem repetições.');
        }

        return { score, feedback, improvements };
    }

    function analyzeC5(text) {
        let rawScore = 40;
        const feedback = [];
        const improvements = [];

        const paragraphTexts = text.split(/\n+/).filter(p => p.trim().length > 15);
        // Analisar os últimos 2 parágrafos como possível conclusão
        const conclusionText = paragraphTexts.length > 1
            ? paragraphTexts.slice(-2).join(' ').toLowerCase()
            : text.toLowerCase();

        // Verificar os 5 elementos da proposta de intervenção
        const hasAgente = countOccurrences(conclusionText, PALAVRAS_INTERVENCAO_AGENTE);
        const hasAcao = countOccurrences(conclusionText, PALAVRAS_INTERVENCAO_ACAO);
        const hasMeio = countOccurrences(conclusionText, PALAVRAS_INTERVENCAO_MEIO);
        const hasFinalidade = countOccurrences(conclusionText, PALAVRAS_INTERVENCAO_FINALIDADE);

        let elements = 0;
        const checklist = [];

        if (hasAgente.count > 0) {
            elements++;
            rawScore += 30;
            checklist.push({ name: 'Agente responsável', present: true, detail: hasAgente.found.join(', ') });
            feedback.push(`✅ Agente identificado: ${hasAgente.found.join(', ')}`);
        } else {
            checklist.push({ name: 'Agente responsável', present: false, detail: '' });
            feedback.push('❌ Agente não identificado — quem vai executar a ação? (ex: Governo Federal, Ministério da Educação, escolas)');
            improvements.push('Especifique QUEM vai agir: "O Ministério da Educação", "O Governo Federal", "As escolas públicas".');
        }

        if (hasAcao.count > 0) {
            elements++;
            rawScore += 30;
            checklist.push({ name: 'Ação concreta', present: true, detail: hasAcao.found.join(', ') });
            feedback.push(`✅ Ação identificada: ${hasAcao.found.join(', ')}`);
        } else {
            checklist.push({ name: 'Ação concreta', present: false, detail: '' });
            feedback.push('❌ Ação não identificada — o que será feito? (ex: implementar, criar, promover)');
            improvements.push('Inclua uma AÇÃO clara: "deve implementar", "é necessário criar", "urge promover".');
        }

        if (hasMeio.count > 0) {
            elements++;
            rawScore += 30;
            checklist.push({ name: 'Modo/Meio', present: true, detail: hasMeio.found.join(', ') });
            feedback.push(`✅ Modo/Meio identificado: ${hasMeio.found.join(', ')}`);
        } else {
            checklist.push({ name: 'Modo/Meio', present: false, detail: '' });
            feedback.push('❌ Modo/Meio não identificado — como será feito? (ex: por meio de campanhas, mediante legislação)');
            improvements.push('Explique COMO a ação será executada: "por meio de", "através de", "mediante".');
        }

        if (hasFinalidade.count > 0) {
            elements++;
            rawScore += 30;
            checklist.push({ name: 'Finalidade/Efeito', present: true, detail: hasFinalidade.found.join(', ') });
            feedback.push(`✅ Finalidade identificada: ${hasFinalidade.found.join(', ')}`);
        } else {
            checklist.push({ name: 'Finalidade/Efeito', present: false, detail: '' });
            feedback.push('❌ Finalidade não identificada — para que serve a ação? (ex: a fim de reduzir, para garantir)');
            improvements.push('Indique a FINALIDADE: "a fim de conscientizar", "para que se garanta", "com o objetivo de reduzir".');
        }

        // Detalhamento (pelo menos 80 palavras na conclusão indica detalhamento)
        const conclusionWordCount = countWords(conclusionText);
        if (conclusionWordCount > 80 && elements >= 3) {
            elements++;
            rawScore += 20;
            checklist.push({ name: 'Detalhamento', present: true, detail: `Conclusão com ${conclusionWordCount} palavras` });
            feedback.push('✅ Proposta apresenta detalhamento adequado.');
        } else {
            checklist.push({ name: 'Detalhamento', present: false, detail: '' });
            if (elements >= 3) {
                feedback.push('⚠️ Proposta presente mas com detalhamento insuficiente. Enriqueça com mais especificidades.');
                improvements.push('Detalhe mais a proposta: nomeie programas específicos, descreva prazos, especifique o público-alvo beneficiado.');
            }
        }

        // Proposta vaga genérica
        const vagueTerms = ['conscientização', 'conscientizar', 'campanhas de conscientização'];
        const { count: vagCount } = countOccurrences(conclusionText, vagueTerms);
        if (vagCount > 0 && elements < 4) {
            rawScore = Math.min(rawScore, 120);
            feedback.push('⚠️ Proposta baseada apenas em "conscientização" sem detalhamento é considerada vaga pelo INEP (máximo 120 pontos).');
            improvements.push('Substitua "conscientização" por uma proposta concreta: especifique agente, ação, meio, finalidade e detalhamento.');
        }

        // Sem nenhuma proposta
        if (elements === 0) {
            rawScore = 0;
            feedback.unshift('Nenhuma proposta de intervenção identificada. A C5 avalia especificamente a proposta de intervenção, que é obrigatória na redação do ENEM.');
            improvements.unshift('PRIORIDADE MÁXIMA: Inclua uma proposta de intervenção completa na conclusão com os 5 elementos: Agente + Ação + Meio + Finalidade + Detalhamento.');
        }

        const score = clampScore(Math.max(0, rawScore));
        if (score < 200) {
            improvements.push('Para nota máxima: sua proposta deve ter os 5 elementos (agente, ação, modo/meio, finalidade, detalhamento), respeitar os direitos humanos e estar articulada ao tema.');
        }

        return { score, feedback, improvements, checklist };
    }

    // ═══════════════════════════════════════════════
    // === FUNÇÃO PRINCIPAL: ANALISAR REDAÇÃO ========
    // ═══════════════════════════════════════════════

    function analyzeEssay(text) {
        const wordCount = countWords(text);
        const paragraphs = countParagraphs(text);

        // Verificar nota zero
        if (wordCount < 50) {
            return {
                total: 0,
                badge: 'Anulada',
                badgeClass: 'failed',
                generalComment: 'Redação anulada: texto com menos de 7 linhas (muito curto). O mínimo exigido pelo INEP é de 7 linhas.',
                competencies: {
                    C1: { score: 0, feedback: ['Texto muito curto para avaliação.'], improvements: ['Escreva uma redação completa com no mínimo 7 linhas.'] },
                    C2: { score: 0, feedback: ['Texto muito curto para avaliação.'], improvements: [] },
                    C3: { score: 0, feedback: ['Texto muito curto para avaliação.'], improvements: [] },
                    C4: { score: 0, feedback: ['Texto muito curto para avaliação.'], improvements: [] },
                    C5: { score: 0, feedback: ['Texto muito curto para avaliação.'], improvements: [], checklist: [] },
                }
            };
        }

        const c1 = analyzeC1(text);
        const c2 = analyzeC2(text);
        const c3 = analyzeC3(text);
        const c4 = analyzeC4(text);
        const c5 = analyzeC5(text);

        const total = c1.score + c2.score + c3.score + c4.score + c5.score;

        // Badge dinâmico
        let badge, badgeClass;
        if (total >= 900) { badge = 'Excelente'; badgeClass = 'excellent'; }
        else if (total >= 700) { badge = 'Bom'; badgeClass = 'good'; }
        else if (total >= 500) { badge = 'Regular'; badgeClass = 'regular'; }
        else if (total >= 300) { badge = 'Precisa Melhorar'; badgeClass = 'needs-work'; }
        else { badge = 'Insuficiente'; badgeClass = 'failed'; }

        // Comentário geral
        let generalComment = '';
        if (total >= 900) {
            generalComment = `Parabéns! Sua redação demonstra excelente domínio textual. Nota ${total}/1000. `;
            const weakest = [{ n: 'C1', s: c1.score }, { n: 'C2', s: c2.score }, { n: 'C3', s: c3.score }, { n: 'C4', s: c4.score }, { n: 'C5', s: c5.score }].sort((a, b) => a.s - b.s)[0];
            if (weakest.s < 200) generalComment += `Para atingir a nota 1000, foque em melhorar a ${weakest.n} (atual: ${weakest.s}/200).`;
        } else if (total >= 700) {
            generalComment = `Boa redação! Nota ${total}/1000. Há pontos específicos a melhorar em cada competência para chegar à nota máxima. Revise os feedbacks detalhados abaixo.`;
        } else if (total >= 500) {
            generalComment = `Redação regular. Nota ${total}/1000. Existem diversos pontos de melhoria. Priorize repertório sociocultural (C2), conectivos (C4) e proposta de intervenção (C5).`;
        } else {
            generalComment = `A redação precisa de melhorias significativas. Nota ${total}/1000. Foque em: estruturar o texto em 4 parágrafos, incluir repertório sociocultural e elaborar uma proposta de intervenção completa.`;
        }

        return {
            total,
            badge,
            badgeClass,
            generalComment,
            competencies: { C1: c1, C2: c2, C3: c3, C4: c4, C5: c5 }
        };
    }

    window.RedacaoPro.Analysis = { analyzeEssay, getLevelLabel };
})();
