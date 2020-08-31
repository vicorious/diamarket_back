'use strict'

async function validateHour (hour, status) {
    if (status.toString() === 'PM') {
        switch (hour.split(':')[0].toString()) {
            case '12' : {
                return '12:00'
            }
            case '1' : {
                return '13:00'
            }
            case '2' : {
                return '14:00'
            }
            case '3' : {
                return '15:00'
            }
            case '4' : {
                return '16:00'
            }
            case '5' : {
                return '17:00'
            }
            case '6' : {
                return '18:00'
            }
            case '7' : {
                return '19:00'
            }
            case '8' : {
                return '20:00'
            }
            case '9' : {
                return '21:00'
            }
            case '10' : {
                return '22:00'
            }
            case '11' : {
                return '23:00'
            }
        }
    } else {
        switch (hour.split(':')[0].toString()) {
            case '12' : {
                return '12:00'
            }
            case '1' : {
                return '01:00'
            }
            case '2' : {
                return '02:00'
            }
            case '3' : {
                return '03:00'
            }
            case '4' : {
                return '04:00'
            }
            case '5' : {
                return '05:00'
            }
            case '6' : {
                return '06:00'
            }
            case '7' : {
                return '07:00'
            }
            case '8' : {
                return '08:00'
            }
            case '9' : {
                return '09:00'
            }
            case '10' : {
                return '10:00'
            }
            case '11' : {
                return '11:00'
            }
        }
    }
}

module.exports = validateHour