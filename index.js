const pacote = require("pacote");
const semver = require("semver");

module.exports = main;

async function main(pkgName="", engines=[]) {
  const packument = await pacote.packument(pkgName);
  const distTags = packument["dist-tags"];

  for (const [distTag, version] of Object.entries(distTags)) {
    if (distTag !== "latest" && semver.lt(version, distTags.latest)) {
      // Delete a dist-tag if it is older than the "latest" stable release version.
      delete distTags[distTag];
    }
  }

  const res = [];

  for (const [tag, version] of Object.entries(distTags)) {
    const pkg = packument.versions[version];
    const obj = {
      name: pkg.name,
      version: pkg.version,
      tag,
      engines: [],
      // pkg,
    };
    for (const engine of engines) {
      const engineSemVer = pkg.dependencies[engine];
      const maxVer = await getMaxSatisfyingSemver(engine, engineSemVer);
      obj.engines.push({engine, version: maxVer, semver: engineSemVer});
    }
    res.push(obj);
  }
  return res;
}

async function getMaxSatisfyingSemver(name, pkgSemver) {
  const packument = await pacote.packument(`${name}@${pkgSemver}`);
  const engineVersions = Object.keys(packument.versions);
  return semver.maxSatisfying(engineVersions, pkgSemver);
}
