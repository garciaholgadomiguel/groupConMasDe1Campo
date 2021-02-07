// [ EJERCICIO ]
// Realizaremos un aggregate para filtrar sus empresas y ganancias

db.ventas.aggregate([
// Hacemos un match para filtrar los productos que nos salen rentables
{ $match: { $expr: { $lt: [ "$CosteFabrica" , "$PrecioPublico" ] } }},
// Ahora hacemos un group por Empresa y año y creamos el campo ganancias
{ $group:
    {
        _id:{
            empresa:"$Empresa",
            año:{$year:"$Fecha"}
            },
            Ganancias: { $sum: { $multiply: [ "$PrecioPublico", "$CantidadVendidas" ]}}
    }
},
// Usamos $project para coger los campos que nos interesan y ademas creamos nuevos campos
{$project: {

    Ganancias: "$Ganancias",
    IVA: {$multiply:["$Ganancias" , 0.21]},
    Beneficios: {$subtract: ["$Ganancias" , {$multiply:["$Ganancias" , 0.21]}]}
}},
// Utilizamos match para ver los beneficios por debajo de 150k
{$match: {Beneficios:{$lt:150000}}},
// Los ordenamos de mayor a menor
{ $sort: { Beneficios: -1 } }

]);


