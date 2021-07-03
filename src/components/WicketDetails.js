import { Dropdown } from 'primereact/dropdown';
import React, { useContext } from 'react'
import { CAUGHT_BY, FIELD_OBSTRUCT, RUN_OUT, STUMPED } from '../constants';
import { WicketDetailsContext } from './UpdateScore';

function SetWhoOut() {
    const { wicketDetails, dispatchWicketDetails, currentBatsmanOptions } = useContext(WicketDetailsContext)
    return (
        <>
            <div className="marg-top-right-bottom-10">Who Out</div>
            <div>
                <Dropdown style={{ width: "100%" }} optionLabel="name" value={wicketDetails.whoOut} options={currentBatsmanOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_WHO_OUT', payload: e.value })} placeholder="Select" />
            </div>
        </>
    )
}

function SetOutByPlayer({ outByHeading }) {
    const { wicketDetails, dispatchWicketDetails, bowlingTeamPlayersOptions } = useContext(WicketDetailsContext)
    return (
        <>
            <div className="marg-top-right-bottom-10">{outByHeading}</div>
            <div>
                <Dropdown style={{ width: "100%" }} optionLabel="name" value={wicketDetails.outByPlayer} options={bowlingTeamPlayersOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_OUT_BY_PLAYER', payload: e.value })} placeholder="Select" />
            </div>
        </>
    )
}

function WicketDetails() {
    const { wicketDetails } = useContext(WicketDetailsContext)
    return (
        <>
            {(() => {
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
            })()}
        </>
    );
}

export default WicketDetails
