import React from 'react'

function ScoreBar({
    battingTeam,
    totalScore,
    totalWickets
}) {
    return (
        <div>
            <div class="rca-row">
                <div class="rca-column-12">
                    <div class="rca-menu-scroll rca-left-border">
                        <ul class="rca-season-list">
                            <li>
                                {battingTeam} {totalScore}/{totalWickets}
                            </li>
                            <li>
                                <a href="#">
                                    IND vs AUS
                                </a>
                            </li>
                            <li>
                                <a href="/widgets.html">
                                    WI vs IND
                                </a>
                            </li>
                            <li>
                                <a href="/widgets.html">
                                    RSA vs NZ
                                </a>
                            </li>
                            <li>
                                <a href="/widgets.html">
                                    ENG vs BAN
                                </a>
                            </li>
                            <li>
                                <a href="/widgets.html">
                                    AUS vs ZIM
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        totalScore: state
    }
}

export default ScoreBar
