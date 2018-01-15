"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit = function(personId, visitId){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'person_visit');
    
    this.personId = personId;
    this.visitId = visitId;
    this.isRV = false;
    this.isStudy = false;

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit
    }
})