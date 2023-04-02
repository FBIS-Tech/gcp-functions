"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsDiallingHistory = void 0;
const query_1 = require("./query");
const objectToExcel_1 = require("./objectToExcel");
async function studentsDiallingHistory(req, res) {
    var _a;
    const studentIds = typeof req.query.studentIds === 'string' ? (_a = req.query.studentIds) === null || _a === void 0 ? void 0 : _a.split(",").map((id) => id.trim()) : [];
    console.log(studentIds, "studentIds");
    try {
        const studentsListPromise = query_1.studentsList(studentIds);
        const students = await studentsListPromise;
        const workbook = await objectToExcel_1.exportToExcel(students);
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
exports.studentsDiallingHistory = studentsDiallingHistory;
