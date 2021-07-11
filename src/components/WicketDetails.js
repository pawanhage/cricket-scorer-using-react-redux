import { Dropdown } from 'primereact/dropdown';
import React, { useContext } from 'react'
import { BOWLED, CAUGHT_BY, FIELD_OBSTRUCT, HIT_WICKET, LBW, RUN_OUT, STUMPED } from '../constants';
import { WicketDetailsContext } from './UpdateScore';

function SetWhoOut() {
    const { wicketDetails, dispatchWicketDetails, currentBatsmanOptions } = useContext(WicketDetailsContext)
    return (
        <div className="marg-right-10">
            <div className="marg-top-right-bottom-10 equal-width">Who Out</div>
            <div className="equal-width">
                <Dropdown disabled={!wicketDetails.wicketType || [BOWLED, LBW, HIT_WICKET, STUMPED, CAUGHT_BY].includes(wicketDetails.wicketType)} optionLabel="name" value={wicketDetails.whoOut} options={currentBatsmanOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_WHO_OUT', payload: e.value })} placeholder="Select" />
            </div>
        </div>
    )
}

function SetOutByPlayer() {
    const { wicketDetails, dispatchWicketDetails, bowlingTeamPlayersOptions } = useContext(WicketDetailsContext)
    let outByHeading = 'Out By';
    if (wicketDetails.wicketType === RUN_OUT) {
        outByHeading = 'Run Out By'
    } else if (wicketDetails.wicketType === CAUGHT_BY) {
        outByHeading = 'Caught By'
    } else if (wicketDetails.wicketType === STUMPED) {
        outByHeading = 'Stumped By'
    }
    return (
        <div>
            <div className="marg-top-right-bottom-10 equal-width">{outByHeading}</div>
            <div className="equal-width">
                <Dropdown disabled={!wicketDetails.wicketType || [BOWLED, LBW, HIT_WICKET, FIELD_OBSTRUCT].includes(wicketDetails.wicketType)} optionLabel="name" value={wicketDetails.outByPlayer} options={bowlingTeamPlayersOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_OUT_BY_PLAYER', payload: e.value })} placeholder="Select" />
            </div>
        </div>
    )
}

function WicketDetails() {
    return (
        <>
            <SetWhoOut></SetWhoOut>
            <SetOutByPlayer></SetOutByPlayer>
        </>
    );
}

export default WicketDetails
