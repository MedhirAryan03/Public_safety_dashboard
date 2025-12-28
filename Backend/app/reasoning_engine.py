class ReasoningEngine:
    """Generates context-aware explanations for crime risk predictions"""

    def __init__(self):
        self.templates = {

            # ===================== TIME-BASED RISK =====================
            "high_risk_night": [
                "🌙 Night hours significantly increase risk due to reduced visibility, fewer witnesses, and lower police patrol density.",
                "🌙 Late-night travel amplifies danger as surveillance effectiveness drops and criminal activity peaks.",
                "🌙 Darkness reduces situational awareness, making night travel inherently more vulnerable."
            ],

            "high_risk_weekend": [
                "📅 Weekends show elevated risk due to nightlife activity, alcohol consumption, and crowd concentration.",
                "📅 Crime frequency increases on weekends as entertainment zones attract opportunistic offenders.",
                "📅 Reduced weekday business surveillance contributes to higher weekend incident rates."
            ],

            # ===================== SEASONAL RISK =====================
            "seasonal_impact": [
                "🌦️ {season} season impacts crime through {season_effect}, altering both public activity and policing efficiency."
            ],

            "high_risk_monsoon": [
                "🌧️ Rainfall reduces CCTV clarity and creates blind spots that criminals exploit.",
                "🌧️ Flooded or poorly lit roads increase response time and reduce patrol coverage.",
                "🌧️ Weather disruptions provide concealment opportunities for criminal activity."
            ],

            # ===================== INFRASTRUCTURE =====================
            "low_infrastructure": [
                "📹 Limited CCTV coverage reduces deterrence and post-incident evidence availability.",
                "🚔 Slower police response increases the risk window during emergencies.",
                "🏢 Sparse police presence limits rapid intervention capability."
            ],

            "good_infrastructure": [
                "✅ Strong CCTV presence acts as an effective deterrent against criminal behavior.",
                "✅ Faster police response ensures quicker containment of incidents.",
                "✅ Dense station coverage improves overall area safety."
            ],

            # ===================== ROUTE HISTORY =====================
            "route_history": [
                "📊 Historical data shows {count} incidents on this route, indicating {trend} risk behavior.",
                "📊 Past crime patterns suggest this corridor has {frequency} activity compared to city averages."
            ],

            # ===================== MITIGATION =====================
            "risk_mitigation": [
                "🛡️ Share your live location with trusted contacts throughout the journey.",
                "🛡️ Avoid isolated shortcuts and stay on main, well-lit roads.",
                "🛡️ Keep emergency contacts easily accessible.",
                "🛡️ Prefer routes with commercial activity and visible surveillance."
            ]
        }

    # ==================================================================
    # TIME REASONING
    # ==================================================================
    def generate_time_reasoning(self, tod, risk_pct, base_risk=45):
        delta = risk_pct - base_risk

        if tod == "Night":
            return [
                self.templates["high_risk_night"][hash(str(risk_pct)) % 3],
                f"Risk is elevated by {delta:.1f}% compared to baseline daytime conditions."
            ]

        if tod == "Evening":
            return [
                "🌆 Evening hours introduce mixed lighting and increased social activity.",
                f"Risk rises by {delta:.1f}% as daylight fades and crowd dynamics change."
            ]

        if tod == "Morning":
            return [
                "🌅 Morning hours provide optimal safety through visibility and commuter presence.",
                f"Risk is reduced by {abs(delta):.1f}% due to natural surveillance."
            ]

        return [
            "☀️ Afternoon travel benefits from strong daylight and business activity.",
            f"Risk is lowered by {abs(delta):.1f}% compared to baseline."
        ]

    # ==================================================================
    # SEASONAL REASONING
    # ==================================================================
    def generate_seasonal_reasoning(self, season, risk_pct):
        effects = {
            "Monsoon": "heavy rainfall, poor visibility, and disrupted patrol routes",
            "Summer": "higher outdoor activity balanced by extended daylight",
            "Winter": "foggy mornings but reduced heat-induced aggression",
            "Post-Monsoon": "normalized visibility and stabilized patrol efficiency"
        }

        return self.templates["seasonal_impact"][0].format(
            season=season,
            season_effect=effects.get(season, "seasonal behavioral changes")
        )

    # ==================================================================
    # INFRASTRUCTURE REASONING
    # ==================================================================
    def generate_infrastructure_reasoning(self, cctv, response_time, stations):
        reasons = []

        # CCTV
        if cctv >= 15:
            reasons.append(f"🎥 Strong CCTV coverage ({cctv:.0f} cameras) significantly deters crime.")
        elif cctv >= 8:
            reasons.append(f"📹 Moderate CCTV presence ({cctv:.0f} cameras) provides partial surveillance.")
        else:
            reasons.append(f"⚠️ Limited CCTV coverage ({cctv:.0f} cameras) increases vulnerability.")

        # Response time
        if response_time <= 8:
            reasons.append(f"🚔 Rapid police response ({response_time:.1f} min) enables swift intervention.")
        elif response_time <= 15:
            reasons.append(f"⏱️ Moderate response time ({response_time:.1f} min) offers acceptable coverage.")
        else:
            reasons.append(f"⚠️ Delayed response time ({response_time:.1f} min) raises incident severity risk.")

        # Stations
        if stations >= 3:
            reasons.append(f"🏢 Multiple police stations ({stations:.0f}) ensure strong area coverage.")
        elif stations >= 2:
            reasons.append(f"🏢 Adequate police presence ({stations:.0f}) supports standard safety.")
        else:
            reasons.append(f"⚠️ Limited station availability ({stations:.0f}) may strain resources.")

        return reasons

    # ==================================================================
    # COMPARATIVE REASONING
    # ==================================================================
    def generate_comparative_reasoning(self, current_time, all_times, is_weekend):
        sorted_times = sorted(all_times.items(), key=lambda x: x[1]["risk_percent"])
        safest, riskiest = sorted_times[0], sorted_times[-1]
        current = all_times[current_time]

        insights = []

        if safest[0] != current_time:
            diff = current["risk_percent"] - safest[1]["risk_percent"]
            insights.append(
                f"💡 Switching to {safest[0]} can reduce risk by {diff:.1f}% "
                f"({current['risk_percent']:.1f}% → {safest[1]['risk_percent']:.1f}%)."
            )
        else:
            insights.append("✅ Current time represents the safest available travel window.")

        if current_time == riskiest[0]:
            insights.append(
                f"⚠️ This is the highest-risk period, with a "
                f"{riskiest[1]['risk_percent'] - safest[1]['risk_percent']:.1f}% spread from safest time."
            )

        if is_weekend:
            insights.append(self.templates["high_risk_weekend"][hash(str(current["risk_percent"])) % 3])

        return insights

    # ==================================================================
    # MITIGATION STRATEGIES
    # ==================================================================
    def generate_mitigation_strategies(self, risk_level, tod, infra_score):
        strategies = []

        if risk_level > 60:
            strategies += [
                "🚨 High-risk scenario: consider rescheduling or choosing safer transport.",
                "🚨 Ensure a trusted contact monitors your journey in real time."
            ]
        elif risk_level > 40:
            strategies += [
                "⚠️ Elevated risk: follow all safety protocols strictly.",
                "⚠️ Avoid route deviations and unverified stops."
            ]

        if tod == "Night":
            strategies += [
                "🌙 Stick to main roads and avoid poorly lit areas.",
                "🌙 Keep your phone charged and emergency numbers ready."
            ]

        if infra_score < 30:
            strategies += [
                "📍 Low-surveillance area: enable continuous live tracking.",
                "📍 Travel with a companion if possible."
            ]

        strategies += self.templates["risk_mitigation"][:2]
        return strategies

    # ==================================================================
    # FULL REASONING PIPELINE
    # ==================================================================
    def generate_full_reasoning(self, prediction_data, infrastructure_data, all_times):
        tod = prediction_data["time_of_day"]
        season = prediction_data["season"]
        is_weekend = prediction_data["is_weekend"]
        risk_pct = prediction_data["risk_percent"]

        cctv = infrastructure_data["cctv"]
        response = infrastructure_data["response_time"]
        stations = infrastructure_data["stations"]

        infra_score = min(100, (cctv/20)*30 + (20-min(response,20))/20*40 + (stations/5)*30)

        primary = []
        if tod in ["Night", "Evening"]:
            primary.append(f"Time of day ({tod}) increases exposure risk")
        if season == "Monsoon":
            primary.append("Weather conditions reduce surveillance effectiveness")
        if is_weekend:
            primary.append("Weekend activity patterns elevate crime probability")
        if infra_score < 40:
            primary.append(f"Weak infrastructure support (score {infra_score:.0f}/100)")

        return {
            "primary_factors": primary or ["Baseline historical risk"],
            "time_analysis": self.generate_time_reasoning(tod, risk_pct),
            "seasonal_analysis": self.generate_seasonal_reasoning(season, risk_pct),
            "infrastructure_analysis": self.generate_infrastructure_reasoning(cctv, response, stations),
            "comparative_analysis": self.generate_comparative_reasoning(tod, all_times, is_weekend),
            "mitigation_strategies": self.generate_mitigation_strategies(risk_pct, tod, infra_score),
            "risk_classification": self._classify_risk(risk_pct)
        }

    # ==================================================================
    # RISK CLASSIFICATION
    # ==================================================================
    def _classify_risk(self, risk_pct):
        if risk_pct >= 70:
            return {"level": "CRITICAL", "color": "🔴", "action": "Strongly avoid or reschedule"}
        elif risk_pct >= 55:
            return {"level": "HIGH", "color": "🟠", "action": "Exercise extreme caution"}
        elif risk_pct >= 40:
            return {"level": "MODERATE", "color": "🟡", "action": "Maintain vigilance"}
        elif risk_pct >= 25:
            return {"level": "LOW", "color": "🟢", "action": "Standard precautions sufficient"}
        else:
            return {"level": "MINIMAL", "color": "🟢", "action": "Safe for travel"}
