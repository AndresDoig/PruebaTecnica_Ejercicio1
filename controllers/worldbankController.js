const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const searchWorldBank = async (req, res) => {
    const entity = req.params.entity.trim().toLowerCase(); // Convertimos a minúsculas y eliminamos espacios extra
    try {
        // Lanza un navegador en modo headless
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();

        // Navega a la página con la búsqueda de la entidad
        await page.goto(`https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms?searchTerm=${entity}`, { waitUntil: 'networkidle2' });

        // Espera a que el selector del contenido dinámico aparezca
        await page.waitForSelector('table');

        // Extrae el contenido de la página cargada dinámicamente
        const content = await page.content();
        
        // Cierra el navegador
        await browser.close();

        // Usa cheerio para analizar el contenido HTML
        const $ = cheerio.load(content);

        let results = [];

        // Vamos a imprimir todos los nombres de las firmas capturadas
        $('table tbody tr').each((i, element) => {
            const firmName = $(element).find('td').eq(0).text().trim().toLowerCase(); // Primer columna: Nombre de la firma

            // Comparación exacta del nombre de la firma
            if (firmName === entity) {
                const address = $(element).find('td').eq(2).text().trim(); // Tercera columna: Dirección
                const country = $(element).find('td').eq(3).text().trim(); // Cuarta columna: País
                const fromDate = $(element).find('td').eq(4).text().trim(); // Quinta columna: Fecha de inicio
                const toDate = $(element).find('td').eq(5).text().trim(); // Sexta columna: Fecha de fin
                const grounds = $(element).find('td').eq(6).text().trim(); // Séptima columna: Motivo

                results.push({
                    FirmName: firmName,
                    Address: address || 'N/A',
                    Country: country || 'N/A',
                    FromDate: fromDate || 'N/A',
                    ToDate: toDate || 'N/A',
                    Grounds: grounds || 'N/A'
                });
            }
        });

        // Enviar los resultados
        res.json({ hits: results.length, results: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar en The World Bank Debarred Firms' });
    }
};

module.exports = { searchWorldBank };
