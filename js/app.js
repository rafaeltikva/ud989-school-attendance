/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */


var model = {
    initializeAttendanceDB: function (names) {
        var attendance = {};

        for (var i = 0; i < names.length; i++) {
            attendance[names[i]] = [];

            for (var j = 0; j < 12; j++) {
                attendance[names[i]].push(this.getRandom());
            }
        }

        // save attendance to DB (localStorage)
        this.updateAttendanceInDB(attendance);

        return attendance;
    },

    updateStudentAttendanceInDB: function (student, studentAttendanceList) {
        var currentAttendance = this.getAttendanceFromDB();

        currentAttendance[student] = studentAttendanceList;
        var newAttendance = currentAttendance;

        this.updateAttendanceInDB(newAttendance);

        return newAttendance
    },

    getAttendanceFromDB: function () {

        return JSON.parse(localStorage.getItem('attendance'));
    },

    updateAttendanceInDB: function (attendance) {
        localStorage.setItem('attendance', JSON.stringify(attendance));
    },

    getRandom: function () {
        return (Math.random() >= 0.5);
    }

};


var controller = {
    initializeAttendance: function (names) {
        return model.initializeAttendanceDB(names);
    },

    updateStudentAttendance: function (student, studentAttendanceList) {
        model.updateStudentAttendanceInDB(student, studentAttendanceList);
    }


};

var view = {
    init: function () {
        // initialize attendance for each students

        var names = this.getNames();

        var initializedAttendance = controller.initializeAttendance(names);

        // add checkboxes to attendants' days & add event listeners to each checkbox

        this.updateCheckboxes(initializedAttendance);

    },

    getNames: function () {
        var nameColumns = $('tbody .name-col'),
            names = [];

        nameColumns.each(function () {
            names.push(this.innerText);
        });

        return names;
    },

    updateCheckboxes: function (attendance) {
        for (var studentAttendance in attendance) {
            if (attendance.hasOwnProperty(studentAttendance)) {
                var $studentRow = $('.name-col:contains("' + studentAttendance + '")').parent();
                var $studentCheckboxes = $studentRow.find('input[type="checkbox"]');
                $studentCheckboxes.each(function (index) {

                    // initialize checkbox to student's attendance that day
                    this.checked = attendance[studentAttendance][index];

                    // update the days missed counter
                    view.updateDaysMissed($studentRow, this.checked, true);

                    // add on change handler
                    $(this).on('change', (function (i, $studentRow) {
                        return function () {

                            view.updateDaysMissed($studentRow, this.checked);

                            attendance[studentAttendance][i] = this.checked;
                            controller.updateStudentAttendance(studentAttendance, attendance[studentAttendance]);
                        }
                    }(index, $studentRow)));

                });
            }
        }

    },

    updateDaysMissed: function ($studentRow, hasAttended, isInit) {

        isInit = isInit || false;

        var missedColumn = $studentRow.children('.missed-col')[0];

        if (hasAttended) {
            missedColumn.innerText++;
        }
        else if (!isInit) {
            missedColumn.innerText--;
        }

    }

};


view.init();