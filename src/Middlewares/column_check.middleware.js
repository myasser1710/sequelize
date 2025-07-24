


export const columnExists = async (tableName, columnName, {queryInterface}) => {

    if (!queryInterface) throw new Error('Missing queryInterface')

    const tableDescription = await queryInterface.describeTable(tableName)

    return !!tableDescription[columnName]
    
};
















