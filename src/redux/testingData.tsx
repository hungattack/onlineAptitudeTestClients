import { createSlice, current } from '@reduxjs/toolkit';
import moment from 'moment';

export interface PropsTestingDataRD {
    id_room: string;
    cateP: string;
    status: boolean;
    startTime: { id: string; start: string; end: string; finish: boolean }[];
    canProcess: {
        id: string; // id catePart
        valueRD: string;
        valueInputRD: string;
        choicesRD: string;
    }[];
    calculate: { idCate: string; correct: number; inCorrect: number; point: number }[];
}
const initialState: PropsTestingDataRD = {
    status: false,
    cateP: '',
    id_room: '',
    startTime: [],
    canProcess: [],
    calculate: [],
};
const testingData = createSlice({
    name: 'testingData',
    initialState: initialState,
    reducers: {
        setCateP: (state, action) => {
            state.cateP = action.payload;
        },
        setStartRD: (
            state,
            action: {
                payload: { id_room: string; others: { id: string; start: string; end: string; finish: boolean } };
            },
        ) => {
            let check = false;
            state.status = true;
            state.id_room = action.payload.id_room;
            state.startTime.map((v) => {
                if (v.id === action.payload.others.id) {
                    check = true;
                }
            });
            if (!check) state.startTime.push(action.payload.others);
        },
        setEnd: (state, action) => {
            state.startTime = state.startTime.map((s) => {
                if (s.id === action.payload.id) {
                    s = {
                        id: s.id,
                        start: '',
                        end: '',
                        finish: true,
                    };
                }
                return s;
            });
        },
        setCandidateProcess: (state, action) => {
            let check = false;
            state.canProcess.map((c) => {
                if (c.id === action.payload.id) {
                    check = true;
                }
            });
            if (!check) state.canProcess.push(action.payload);
        },
        setValueRD: (
            state,
            action: { payload: { id: string; value: string } }, //{ id: string; value: string[]; index: number }
        ) => {
            state.canProcess = state.canProcess.map((c) => {
                if (c.id === action.payload.id) {
                    c.valueRD = action.payload.value;
                }
                return c;
            });
        },
        setValueInputRD: (
            state,
            action: { payload: { id: string; valueInput: string } }, // { id: string; value: string; index: number }
        ) => {
            state.canProcess = state.canProcess.map((c) => {
                if (c.id === action.payload.id) {
                    c.valueInputRD = action.payload.valueInput;
                }
                return c;
            });
        },
        setChoiceRD: (
            state,
            action: { payload: { id: string; choice: string } }, //{ id: string; value: string[]; index: number }
        ) => {
            state.canProcess = state.canProcess.map((c) => {
                if (c.id === action.payload.id) {
                    c.choicesRD = action.payload.choice;
                }
                return c;
            });
        },
        setCalculate: (
            state,
            action: { payload: { idCate: string; correct: number; inCorrect: number; point: number } },
        ) => {
            if (!state.calculate.some((c) => c.idCate === action.payload.idCate)) {
                state.calculate.push(action.payload);
            }
        },
        setResetAll: (state) => {
            state.id_room = '';
            state.cateP = '';
            state.startTime = [];
            state.status = false;
            state.canProcess = [];
        },
    },
});
export const {
    setCateP,
    setResetAll,
    setCalculate,
    setStartRD,
    setEnd,
    setCandidateProcess,
    setValueRD,
    setValueInputRD,
    setChoiceRD,
} = testingData.actions;
export default testingData.reducer;
