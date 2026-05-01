import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "GradConnect",
        short_name: "GradConnect",
        description:
            "Nigeria's graduate career intelligence platform — discover employers, understand assessments, prepare to apply.",
        start_url: "/",
        display: "standalone",
        background_color: "#F5EBD9",
        theme_color: "#9C2A1A",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}