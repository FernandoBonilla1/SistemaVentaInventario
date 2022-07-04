const connection = require('../config/db');
const PDF = require('pdfkit-construct');
const functions = require('../helpers/functionshelper');
const reportFunctions = {}

reportFunctions.reporte_productos_defectuosos = async (req, res) => {
    try {
        const doc = new PDF({
            size: 'A4',
            margins: { top: 10, left: 10, right: 10, bottom: 10 },
            bufferPages: true
        });

        const filename = `Reporte de productos defectuosos ${Date.now()}.pdf`;

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-disposition': `attachment;filename=${filename}`
        });
        doc.on('data', (data) => { stream.write(data) });
        doc.on('end', () => { stream.end() });

        const defective_products = await connection.query('Select defective_product.id, sale.id as idventa, sale.date as fecha, product.id as idproducto, product.name as nombreproducto, defective_product.descripcion, defective_product.amount as amount from defective_product inner join sale on (sale.id = defective_product.id_sale) inner join product on (defective_product.id_product = product.id)')
        const registros = defective_products.rows.map((defective_product) => {
            const registro = {
                id: defective_product.id,
                idventa: defective_product.idventa,
                id_product: defective_product.idproducto,
                nombreProducto: defective_product.nombreproducto,
                descripcion: defective_product.descripcion,
                amount: defective_product.amount
            }
            return registro
        })

        doc.setDocumentHeader({ height: '10' }, () => {
            doc.fontSize(18).text('Reporte de productos defectuosos\n', {
                align: 'center'
            });

            doc.fontSize(12);

            doc.text('EMPRESA: MACACO', {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`FECHA DE REPORTE: ${functions.getCurrentDate()}`, {
                marginLeft: 100,
                align: 'left'
            })

        })

        doc.addTable([
            { key: 'id', label: 'ID', align: 'left'},
            { key: 'idventa', label: 'Venta', align: 'left' },
            { key: 'id_product', label: 'ID P', align: 'left' },
            { key: 'nombreProducto', label: 'Nombre producto', align: 'left' },
            { key: 'descripcion', label: "Descripcion", align: 'left' },
            { key: 'amount', label: "Cantidad", align: 'left'}
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

reportFunctions.boleta = async (req, res) => {
    
    try {
        const {id} = req.body;
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

        const ventas = await connection.query('Select users.name as nombrevendedor, client.rut as rutcliente, client.name as nombrecliente, client.surname as apellidocliente, sale.id as id_sale, details.id_product as id_product, product.name as nombre, details.amount as amount, product.value as price_unit, details.price as price from sale inner join details on (sale.id = details.id_sale) inner join product on (details.id_product = product.id) inner join users on (users.rut = sale.id_salesman) inner join users as client on (client.rut = sale.id_cliente) WHERE sale.id = $1',[id])
        const nombre_vendedor = ventas.rows[0].nombrevendedor
        const rut_cliente = ventas.rows[0].rutcliente
        const nombre_cliente = ventas.rows[0].nombrecliente
        const id_venta = ventas.rows[0].id_sale
        const apellido_cliente = ventas.rows[0].apellidocliente
        const total = ventas.rows.map(sale => sale.price).reduce((prev,curr) => prev + curr, 0);
        const registros = ventas.rows.map((venta) => {
            const registro = {
                id: venta.id_product,
                name: venta.nombre,
                amount: venta.amount,
                price_unit: `$${venta.price_unit}`,
                price: `$${venta.price}`
            }
            return registro
        })

        doc.setDocumentHeader({ height: '12' }, () => {
            doc.fontSize(18).text('BOLETA\n', {
                align: 'center'
            });

            doc.fontSize(12);

            doc.text(`Codigo Venta: ${id_venta}`, {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`Nombre vendedor: ${nombre_vendedor}`, {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`Rut cliente: ${rut_cliente}`, {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`Nombre cliente: ${nombre_cliente} ${apellido_cliente}`, {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`FECHA DE VENTA: ${functions.getCurrentDate()}`, {
                marginLeft: 150,
                margins: 200,
                align: 'left'
            })

        })

        doc.addTable([
            { key: 'id', label: 'ID', align: 'left' },
            { key: 'name', label: 'Nombre', align: 'left' },
            { key: 'amount', label: 'Cantidad', align: 'left' },
            { key: 'price_unit', label: 'Precio unit', align: 'left' },
            { key: 'price', label: "Total", align: 'left' }
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

        doc.setDocumentFooter({height:'60%'}, () => {
            doc.fontSize(15).text(`TOTAL: $${total} CLP.`, doc.footer.x, doc.footer.y + 10);
        });
        doc.render();
        doc.end();

    } catch (error) {
        res.status(500).json({
            msg: "No se pudo crear el documento",
            error
        })
    }
    
}

reportFunctions.reporteExistecia = async (req, res) => {
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

        doc.setDocumentHeader({ height: '10' }, () => {
            doc.fontSize(18).text('Reporte Existencias\n', {
                align: 'center'
            });

            doc.fontSize(12);

            doc.text('EMPRESA: MACACO', {
                marginLeft: 150,
                align: 'left'
            })
            doc.text(`FECHA DE REPORTE: ${functions.getCurrentDate()}`, {
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

module.exports = reportFunctions