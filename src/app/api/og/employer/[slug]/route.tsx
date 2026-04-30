import { ImageResponse } from "next/og";
import { getEmployer } from "@/lib/api/endpoints/employers.server";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 } as const;

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
    const { slug } = await params;

    let employer;
    try {
        const result = await getEmployer(slug);
        employer = result.data;
    } catch {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        background: "#fdf9f3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "serif",
                        fontSize: 64,
                        color: "#73262e",
                    }}
                >
                    GradConnect
                </div>
            ),
            { ...SIZE },
        );
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#fdf9f3",
                    padding: "60px 80px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    fontFamily: "serif",
                    color: "#1a1a1a",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#73262e",
                        letterSpacing: "-0.02em",
                    }}
                >
                    GradConnect
                </div>

                {/* Main content */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            fontSize: 18,
                            color: "#8a7a6a",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        Employer hub
                    </div>
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            display: "block",
                        }}
                    >
                        {employer.name}
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: "#5a4a3a",
                            fontStyle: "italic",
                        }}
                    >
                        {employer.industry}
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        fontSize: 20,
                        color: "#5a4a3a",
                    }}
                >
                    {employer.hq_location ?? "Nigeria"}
                </div>
            </div>
        ),
        { ...SIZE },
    );
}