import { createSlice, current } from '@reduxjs/toolkit';
import moment from 'moment';

export interface PropsTestingDataRD {
    id_room: string;
    status: boolean;
    startTime: { id: string; start: string; end: string; finish: boolean }[];
    valueRD: string;
    valueInputRD: string;
    choicesRD: string;
}
const initialState: PropsTestingDataRD = {
    status: false,
    id_room: '',
    startTime: [],
    valueRD: '',
    valueInputRD: '',
    choicesRD: '',
};
const testingData = createSlice({
    name: 'testingData',
    initialState: initialState,
    reducers: {
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
                        finish: false,
                    };
                }
                return s;
            });
        },
        setCandidateProcess: (state, action) => {
            state.valueRD = action.payload.value;
            state.valueInputRD = action.payload.valueInput;
            state.choicesRD = action.payload.choices;
        },
        setValueRD: (state, action) => {
            state.valueRD = action.payload.value;
        },
        setValueInputRD: (state, action) => {
            const data = action.payload.valueInput;
            state.valueInputRD = data;
        },
        setChoiceRD: (state, action) => {
            state.choicesRD = action.payload.choices;
        },
    },
});
export const { setStartRD, setEnd, setCandidateProcess, setValueRD, setValueInputRD, setChoiceRD } =
    testingData.actions;
export default testingData.reducer;
