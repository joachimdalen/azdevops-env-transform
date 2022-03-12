mkdir -p docs/generated/tasks
cp docs/tasks/_category_.json docs/generated/tasks/_category_.json
azext readme generate --input ./docs/index.md --output ./docs/generated/index.md --profile doc-site
azext readme generate --input ./docs/tasks/env-transform.md --output ./docs/generated/tasks/env-transform.md --profile doc-site

azext readme generate --input ./tasks/env-transform/docs/README.md --output ./tasks/env-transform/README.md --profile github

azext changelog generate

echo "---\nsidebar_position: 2\ntitle: 'Changelog'\n---\n$(cat CHANGELOG.md)" > ./docs/generated/changelog.md