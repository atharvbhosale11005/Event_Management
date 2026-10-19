const createResult = (err, data) => {

    if (err) {
        return {
            status: "error",
            message: typeof err === "string"
                ? err
                : err.sqlMessage || err.message || "Something went wrong"
        };
    }

    return {
        status: "success",
        data: data
    };
};

module.exports = {
    createResult
};