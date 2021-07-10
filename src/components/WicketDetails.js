import { Dropdown } from 'primereact/dropdown';
import React, { useContext } from 'react'
import { BOWLED, CAUGHT_BY, FIELD_OBSTRUCT, HIT_WICKET, LBW, RUN_OUT, STUMPED } from '../constants';
import { WicketDetailsContext } from './UpdateScore';

function SetWhoOut() {
    const { wicketDetails, dispatchWicketDetails, currentBatsmanOptions } = useContext(WicketDetailsContext)
    return (
        <>
            <div className="marg-top-right-bottom-10">Who Out (*disable if striker batsman is out)</div>
            <div>
                <Dropdown disabled={!wicketDetails.wicketType || [BOWLED, LBW, HIT_WICKET, STUMPED].includes(wicketDetails.wicketType)} optionLabel="name" value={wicketDetails.whoOut} options={currentBatsmanOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_WHO_OUT', payload: e.value })} placeholder="Select" />
            </div>
        </>
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
        <>
            <div className="marg-top-right-bottom-10">{outByHeading}</div>
            <div>
                <Dropdown disabled={!wicketDetails.wicketType || [BOWLED, LBW, HIT_WICKET, FIELD_OBSTRUCT].includes(wicketDetails.wicketType)} optionLabel="name" value={wicketDetails.outByPlayer} options={bowlingTeamPlayersOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_OUT_BY_PLAYER', payload: e.value })} placeholder="Select" />
            </div>
        </>
    )
}

function WicketDetails() {
    const { wicketDetails } = useContext(WicketDetailsContext)
    return (
        <>
            <SetWhoOut></SetWhoOut>
            <SetOutByPlayer></SetOutByPlayer>

            {/* {(() => {
                if (wicketDetails.wicketType === RUN_OUT) {
                    return (
                        <>
                            <SetWhoOut></SetWhoOut>
                            <SetOutByPlayer outByHeading={'Run Out By'}></SetOutByPlayer>
                        </>
                    )
                } else if (wicketDetails.wicketType === CAUGHT_BY || wicketDetails.wicketType === STUMPED) {
                    const outByHeading = wicketDetails.wicketType === CAUGHT_BY ? 'Caught By' : 'Stumped By';
                    return (
                        <>
                            <SetOutByPlayer outByHeading={outByHeading}></SetOutByPlayer>
                        </>
                    )
                } else if (wicketDetails.wicketType === FIELD_OBSTRUCT) {
                    return (
                        <>
                            <SetWhoOut></SetWhoOut>
                        </>
                    )
                }
                return <></>;
            })()} */}
        </>
    );
}

export default WicketDetails
