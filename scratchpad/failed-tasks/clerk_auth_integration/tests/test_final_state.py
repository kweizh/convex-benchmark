import os
import json
import pytest

PROJECT_DIR = "/home/user/app"

def test_clerk_installed():
    pkg_path = os.path.join(PROJECT_DIR, "package.json")
    with open(pkg_path) as f:
        pkg = json.load(f)
    deps = pkg.get("dependencies", {})
    assert "@clerk/nextjs" in deps, "@clerk/nextjs not found in package.json dependencies."

def test_auth_config():
    auth_config_path = os.path.join(PROJECT_DIR, "convex", "auth.config.ts")
    assert os.path.isfile(auth_config_path), f"auth.config.ts not found at {auth_config_path}."
    with open(auth_config_path) as f:
        content = f.read()
    assert "CLERK_JWT_ISSUER_DOMAIN" in content, "Expected CLERK_JWT_ISSUER_DOMAIN in auth.config.ts."
    assert "applicationID" in content and "convex" in content, "Expected applicationID 'convex' in auth.config.ts."

def test_middleware():
    middleware_path = os.path.join(PROJECT_DIR, "middleware.ts")
    assert os.path.isfile(middleware_path), f"middleware.ts not found at {middleware_path}."
    with open(middleware_path) as f:
        content = f.read()
    assert "clerkMiddleware" in content, "Expected clerkMiddleware in middleware.ts."

def test_convex_client_provider():
    provider_path = os.path.join(PROJECT_DIR, "components", "ConvexClientProvider.tsx")
    assert os.path.isfile(provider_path), f"ConvexClientProvider.tsx not found at {provider_path}."
    with open(provider_path) as f:
        content = f.read()
    assert "ConvexProviderWithClerk" in content, "Expected ConvexProviderWithClerk in ConvexClientProvider.tsx."
    assert "useAuth" in content, "Expected useAuth in ConvexClientProvider.tsx."

def test_layout_updated():
    layout_path = os.path.join(PROJECT_DIR, "app", "layout.tsx")
    with open(layout_path) as f:
        content = f.read()
    assert "ClerkProvider" in content, "Expected ClerkProvider in app/layout.tsx."
    assert "ConvexClientProvider" in content, "Expected ConvexClientProvider in app/layout.tsx."

def test_convex_messages_query():
    messages_path = os.path.join(PROJECT_DIR, "convex", "messages.ts")
    assert os.path.isfile(messages_path), f"messages.ts not found at {messages_path}."
    with open(messages_path) as f:
        content = f.read()
    assert "getUserIdentity" in content, "Expected getUserIdentity check in messages.ts."
    assert "Not authenticated" in content, "Expected 'Not authenticated' error in messages.ts."
