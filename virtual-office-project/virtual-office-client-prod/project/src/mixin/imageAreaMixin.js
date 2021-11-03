export const imageAreaMixin = {
    methods: {
        getStartDestination: function(mapData) {
            let self = this;
            for (let i = 0; i < this.tables.length; i++) {
                let mapDataKeys = Object.keys(mapData[self.tables[i]]);
                for (let j = 1; j < mapDataKeys.length; j++) {
                    if (!mapData[self.tables[i]][`chair_${j}`].sitting) {
                        self.mapData[self.tables[i]][`chair_${j}`].seatedPerson = this.$store.getters["commonStore/getUserName"];
                        self.mapData[self.tables[i]][`chair_${j}`].sitting = true;
                        return {
                            table: self.tables[i],
                            session_id: mapData[self.tables[i]].id,
                            table_num: i,
                            chair_num: j,
                            change_session: false,
                        };
                    }
                }
            }
        },
        getDestination: function(mapData) {
            let self = this;
            const myDestination = this.myDestination;
            for (let i = 0; i < this.tables.length; i++) {
                let mapDataKeys = Object.keys(mapData[self.tables[i]]);
                for (let j = 1; j < mapDataKeys.length; j++) {
                    if (
                        mapData[self.tables[i]][`chair_${j}`].x <= self.offsetX &&
                        self.offsetX <=
                        mapData[self.tables[i]][`chair_${j}`].x +
                        mapData[self.tables[i]][`chair_${j}`].width &&
                        mapData[self.tables[i]][`chair_${j}`].y <= self.offsetY &&
                        self.offsetY <=
                        mapData[self.tables[i]][`chair_${j}`].y +
                        mapData[self.tables[i]][`chair_${j}`].height
                    ) {
                        if (mapData[self.tables[i]][`chair_${j}`].sitting) {
                            return self.myDestination;
                        }

                        if (!mapData[self.tables[i]][`chair_${j}`].sitting) {
                            self.mapData[self.myDestination.table][`chair_${self.myDestination.chair_num}`].seatedPerson = "";
                            self.mapData[self.myDestination.table][`chair_${self.myDestination.chair_num}`].sitting = false;
                            self.mapData[self.tables[i]][`chair_${j}`].seatedPerson = this.$store.getters["commonStore/getUserName"];
                            self.mapData[self.tables[i]][`chair_${j}`].sitting = true;
                        } else {
                            return self.myDestination;
                        }

                        let changeSession = false;
                        if (mapData[self.tables[i]].id !== myDestination.session_id) changeSession = true;

                        return {
                            table: self.tables[i],
                            session_id: mapData[self.tables[i]].id,
                            table_num: i,
                            chair_num: j,
                            change_session: changeSession,
                        };
                    }
                }
            }

            this.myDestination.change_session = false;
            return this.myDestination;
        },
        getFilledDestination: function(mapData) {
            let filledDestination = []
            let self = this;
            for (let i = 0; i < this.tables.length; i++) {
                let mapDataKeys = Object.keys(mapData[self.tables[i]]);
                for (let j = 1; j < mapDataKeys.length; j++) {
                    if (mapData[self.tables[i]][`chair_${j}`].sitting) {
                        filledDestination.push({
                            table: self.tables[i],
                            seated_person: mapData[self.tables[i]][`chair_${j}`].seatedPerson,
                            table_num: i,
                            chair_num: j,
                        });
                    }
                }
            }

            return filledDestination;
        },
        deleteMyDestination: function() {
            this.mapData[this.myDestination.table][`chair_${this.myDestination.chair_num}`].seatedPerson = "";
            this.mapData[this.myDestination.table][`chair_${this.myDestination.chair_num}`].sitting = false;
        }
    },
}

export default imageAreaMixin;