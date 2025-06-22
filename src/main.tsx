// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./libs/query.ts";
import { store, persistor } from "./app/store.ts";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    // </StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                    <App />
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);
