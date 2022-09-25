"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsRecord = void 0;
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function studentsRecord(req, res) {
    var _a;
    console.log(req);
    const schoolId = (_a = req.query.schoolId) !== null && _a !== void 0 ? _a : null;
    try {
        const studentsListPromise = query_1.studentsList(schoolId);
        const [students] = await studentsListPromise;
        const data = [students];
        console.log("Data: ", data);
        const workbook = await objectToExcel_1.exportToExcel(data);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="students-list.xlsx`);
        return workbook.xlsx.write(res)
            .then(() => {
            res.status(200).end();
        });
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}
exports.studentsRecord = studentsRecord;
