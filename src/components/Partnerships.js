import React from 'react'


function Partnerships({ inning }) {

    return (
        <div className="rca-batting-score rca-padding ">
            {
                (() => {
                    return inning.partnerships.map((partnership, index) => {
                        const firstBatsman = Object.keys(partnership)[0];
                        const secondBatsman = Object.keys(partnership)[1];
                        const firstBatsmanScore = partnership[firstBatsman].runsScored;
                        const secondBatsmanScore = partnership[secondBatsman].runsScored;
                        const totalPartnership = firstBatsmanScore + secondBatsmanScore;
                        const firstBatsmanContributionInPercentage = (firstBatsmanScore / totalPartnership) * 100;
                        const secondBatsmanContributionInPercentage = (secondBatsmanScore / totalPartnership) * 100;

                        return (
                            <>
                                <div className="pad-10 rca-no-bottom-padding" style={{ borderBottom: '1px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '50%', }}>
                                            <span className="rca-match-title">{firstBatsman}</span>
                                            <span className="rca-match-score">{firstBatsmanScore}({partnership[firstBatsman].ballsFaced})</span>
                                            <span className="rca-match-title">{`&`}</span>
                                            <span className="rca-match-title">{secondBatsman}</span>
                                            <span className="rca-match-score">{secondBatsmanScore}({partnership[secondBatsman].ballsFaced})</span>
                                        </div>
                                        <div className="progress">
                                            <div className="barR" style={{ width: firstBatsmanContributionInPercentage, borderRight: '1px solid #6c757d' }}>
                                                <p className="percent">
                                                </p>
                                            </div>
                                        </div>
                                        <div className="progress">
                                            <div className="barL" style={{ width: secondBatsmanContributionInPercentage }}>
                                                <p className="percent">
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ width: '10%', marginLeft: '20px' }}>
                                            <span className="rca-match-score">{partnership[Object.keys(partnership)[0]].runsScored + partnership[Object.keys(partnership)[1]].runsScored}({partnership[Object.keys(partnership)[0]].ballsFaced + partnership[Object.keys(partnership)[1]].ballsFaced})</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    });
                })()
            }
        </div>
    )
}

export default Partnerships
