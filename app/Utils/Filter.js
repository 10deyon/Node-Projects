exports.filter = async () => {
    const pageNumber = 2;
    const pageSize = 10;

    const variable = await Model
    // COMPARISON
    .find({ price: { $gte: 10, $lte: 20 } })
    
    // LOGICAL
    .find({ price: { $in: [10, 20, 30] } })
    
    // REGULAR EXPRESSIONS
    .find({ name: /^Emmanuel/ }) //starts with
    .find({ name: /Emmanuel$/i }) //ends with
    .find({ name: /.*Emmanuel.*/i }) //starts with

    .or([ { name: 'yuan' } ]) // works like laravel's orWhere
    .and([ { name: 'joe' } ]) // compare to laravel


    //pagination
    skip((pageNumber -1) * pageSize)
    .limit(10)
    .sort()

    // after sorting, you can select any of these methods to complete query
    .count()
    .select({ name: -1 /*(desc) or 1 (asc)*/})

}
