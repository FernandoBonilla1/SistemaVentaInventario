const connection = require('../config/db');
const PDF = require('pdfkit-construct');

const formatDate = (date) => {
    let formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    return formatted_date;
}

const boleta = async (req, res) => {
    try {
        const doc = new PDF({
            size: 'A4',
            margins: { top: 10, left: 10, right: 10, bottom: 10 },
            bufferPages: true
        });

        const filename = `Boleta ${Date.now()}.pdf`;

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=${filename}`
        });
        doc.on('data', (data) => { stream.write(data) });
        doc.on('end', () => { stream.end() });

        const products = await connection.query('SELECT product.id, product.name, product.brand, product.description, product.amount, product.value, subcategory.name as subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category)')
        const registros = products.rows.map((product) => {
            const registro = {
                id: product.id,
                subcategory: product.subcategory,
                name: product.name,
                amount: product.amount,
                value: `$${product.value}`,
                total: `$${product.value * product.amount}`
            }
            return registro
        })

        var date = new Date();
        doc.setDocumentHeader({ height: '10' }, () => {
            doc.fontSize(18).text('Reporte Existencias\n', {
                align: 'center'
            });

            doc.fontSize(12);

            doc.text('EMPRESA: MACACO', {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`FECHA DE REPORTE: ${formatDate(date)}`, {
                marginLeft: 100,
                align: 'left'
            })

        })

        doc.addTable([
            { key: 'id', label: 'ID', align: 'left' },
            { key: 'subcategory', label: 'Subcategoria', align: 'left' },
            { key: 'name', label: 'Nombre', align: 'left' },
            { key: 'amount', label: 'Cantidad', align: 'left' },
            { key: 'value', label: 'Precio', align: 'left' },
            { key: 'total', label: "Total", align: 'left' }
        ], registros, {
            border: { size: 0.1, color: '#cdcdcd' },
            width: "fill_body",
            striped: false,
            stripedColors: ["#f6f6f6", "#d6c4dd"],
            cellsPadding: 10,
            marginLeft: 10,
            marginRight: 10,
            headAlign: 'left'
        })
        doc.render();
        doc.end();

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear el documento",
            error
        })
    }
}

const reporteExistecia = async (req, res) => {
    try {

        const doc = new PDF({
            size: 'A4',
            margins: { top: 10, left: 10, right: 10, bottom: 10 },
            bufferPages: true
        });

        const filename = `Reporte Existencia ${Date.now()}.pdf`;

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=${filename}`
        });
        doc.on('data', (data) => { stream.write(data) });
        doc.on('end', () => { stream.end() });

        const products = await connection.query('SELECT product.id, product.name, product.brand, product.description, product.amount, product.value, subcategory.name as subcategory FROM product inner join subcategory on (subcategory.id = product.id_subcategory) inner join category on (category.id = subcategory.id_category)')
        const registros = products.rows.map((product) => {
            const registro = {
                id: product.id,
                subcategory: product.subcategory,
                name: product.name,
                amount: product.amount,
                value: `$${product.value}`,
                total: `$${product.value * product.amount}`
            }
            return registro
        })

        var date = new Date();
        doc.setDocumentHeader({ height: '10' }, () => {
            doc.fontSize(18).text('Reporte Existencias\n', {
                align: 'center'
            });

            doc.fontSize(12);

            doc.text('EMPRESA: MACACO', {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`FECHA DE REPORTE: ${formatDate(date)}`, {
                marginLeft: 100,
                align: 'left'
            })

        })

        doc.addTable([
            { key: 'id', label: 'ID', align: 'left' },
            { key: 'subcategory', label: 'Subcategoria', align: 'left' },
            { key: 'name', label: 'Nombre', align: 'left' },
            { key: 'amount', label: 'Cantidad', align: 'left' },
            { key: 'value', label: 'Precio', align: 'left' },
            { key: 'total', label: "Total", align: 'left' }
        ], registros, {
            border: { size: 0.1, color: '#cdcdcd' },
            width: "fill_body",
            striped: false,
            stripedColors: ["#f6f6f6", "#d6c4dd"],
            cellsPadding: 10,
            marginLeft: 10,
            marginRight: 10,
            headAlign: 'left'
        })
        doc.render();
        doc.end();

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear el documento",
            error
        })
    }


}

module.exports = {
    reporteExistecia
}