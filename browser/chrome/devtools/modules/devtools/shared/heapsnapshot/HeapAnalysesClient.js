/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const DevToolsUtils = require("devtools/shared/DevToolsUtils");
const { DevToolsWorker } = require("devtools/shared/worker/worker");

const WORKER_URL =
  "resource://devtools/shared/heapsnapshot/HeapAnalysesWorker.js";
var workerCounter = 0;

/**
 * A HeapAnalysesClient instance provides a developer-friendly interface for
 * interacting with a HeapAnalysesWorker. This enables users to be ignorant of
 * the message passing protocol used to communicate with the worker. The
 * HeapAnalysesClient owns the worker, and terminating the worker is done by
 * terminating the client (see the `destroy` method).
 */
const HeapAnalysesClient = module.exports = function () {
  this._worker = new DevToolsWorker(WORKER_URL, {
    name: `HeapAnalyses-${workerCounter++}`,
    verbose: DevToolsUtils.dumpv.wantVerbose
  });
};

/**
 * Destroy the worker, causing it to release its resources (such as heap
 * snapshots it has deserialized and read into memory). The client is no longer
 * usable after calling this method.
 */
HeapAnalysesClient.prototype.destroy = function () {
  this._worker.destroy();
  this._worker = null;
};

/**
 * Tell the worker to read into memory the heap snapshot at the given file
 * path. This is a prerequisite for asking the worker to perform various
 * analyses on a heap snapshot.
 *
 * @param {String} snapshotFilePath
 *
 * @returns Promise
 *          The promise is fulfilled if the heap snapshot is successfully
 *          deserialized and read into memory. The promise is rejected if that
 *          does not happen, eg due to a bad file path or malformed heap
 *          snapshot file.
 */
HeapAnalysesClient.prototype.readHeapSnapshot = function (snapshotFilePath) {
  return this._worker.performTask("readHeapSnapshot", { snapshotFilePath });
};

/**
 * Tell the worker to delete all references to the snapshot and dominator trees
 * linked to the provided snapshot file path.
 *
 * @param {String} snapshotFilePath
 * @return Promise<undefined>
 */
HeapAnalysesClient.prototype.deleteHeapSnapshot = function (snapshotFilePath) {
  return this._worker.performTask("deleteHeapSnapshot", { snapshotFilePath });
};

/**
 * Request the creation time given a snapshot file path. Returns `null`
 * if snapshot does not exist.
 *
 * @param {String} snapshotFilePath
 *        The path to the snapshot.
 * @return {Number?}
 *        The unix timestamp of the creation time of the snapshot, or null if
 *        snapshot does not exist.
 */
HeapAnalysesClient.prototype.getCreationTime = function (snapshotFilePath) {
  return this._worker.performTask("getCreationTime", snapshotFilePath);
};

/*** Censuses *****************************************************************/

/**
 * Ask the worker to perform a census analysis on the heap snapshot with the
 * given path. The heap snapshot at the given path must have already been read
 * into memory by the worker (see `readHeapSnapshot`).
 *
 * @param {String} snapshotFilePath
 *
 * @param {Object} censusOptions
 *        A structured-cloneable object specifying the requested census's
 *        breakdown. See the "takeCensus" section of
 *        `js/src/doc/Debugger/Debugger.Memory.md` for detailed documentation.
 *
 * @param {Object} requestOptions
 *        An object specifying options of this worker request.
 *        - {Boolean} asTreeNode
 *          Whether or not the census is returned as a CensusTreeNode,
 *          or just a breakdown report. Defaults to false.
 *          @see `devtools/shared/heapsnapshot/census-tree-node.js`
 *        - {Boolean} asInvertedTreeNode
 *          Whether or not the census is returned as an inverted
 *          CensusTreeNode. Defaults to false.
 *        - {String} filter
 *          A filter string to prune the resulting tree with. Only applies if
 *          either asTreeNode or asInvertedTreeNode is true.
 *
 * @returns Promise<Object>
 *          An object with the following properties:
 *          - report:
 *            The report generated by the given census breakdown, or a
 *            CensusTreeNode generated by the given census breakdown if
 *            `asTreeNode` is true.
 *          - parentMap:
 *            The result of calling CensusUtils.createParentMap on the generated
 *            report. Only exists if asTreeNode or asInvertedTreeNode are set.
 */
HeapAnalysesClient.prototype.takeCensus = function (snapshotFilePath,
                                                    censusOptions,
                                                    requestOptions={}) {
  return this._worker.performTask("takeCensus", {
    snapshotFilePath,
    censusOptions,
    requestOptions,
  });
};

/**
 * Request that the worker take a census on the heap snapshots with the given
 * paths and then return the difference between them. Both heap snapshots must
 * have already been read into memory by the worker (see `readHeapSnapshot`).
 *
 * @param {String} firstSnapshotFilePath
 *        The first snapshot file path.
 *
 * @param {String} secondSnapshotFilePath
 *        The second snapshot file path.
 *
 * @param {Object} censusOptions
 *        A structured-cloneable object specifying the requested census's
 *        breakdown. See the "takeCensus" section of
 *        `js/src/doc/Debugger/Debugger.Memory.md` for detailed documentation.
 *
 * @param {Object} requestOptions
 *        An object specifying options for this request.
 *        - {Boolean} asTreeNode
 *          Whether the resulting delta report should be converted to a census
 *          tree node before returned. Defaults to false.
 *        - {Boolean} asInvertedTreeNode
 *          Whether or not the census is returned as an inverted
 *          CensusTreeNode. Defaults to false.
 *        - {String} filter
 *          A filter string to prune the resulting tree with. Only applies if
 *          either asTreeNode or asInvertedTreeNode is true.
 *
 * @returns Promise<Object>
 *          - delta:
 *            The delta report generated by diffing the two census reports, or a
 *            CensusTreeNode generated from the delta report if
 *            `requestOptions.asTreeNode` was true.
 *          - parentMap:
 *            The result of calling CensusUtils.createParentMap on the generated
 *            delta. Only exists if asTreeNode or asInvertedTreeNode are set.
 */
HeapAnalysesClient.prototype.takeCensusDiff = function (firstSnapshotFilePath,
                                                        secondSnapshotFilePath,
                                                        censusOptions,
                                                        requestOptions = {}) {
  return this._worker.performTask("takeCensusDiff", {
    firstSnapshotFilePath,
    secondSnapshotFilePath,
    censusOptions,
    requestOptions
  });
};

/*** Dominator Trees **********************************************************/

/**
 * Compute the dominator tree of the heap snapshot loaded from the given file
 * path. Returns the id of the computed dominator tree.
 *
 * @param {String} snapshotFilePath
 *
 * @returns {Promise<DominatorTreeId>}
 */
HeapAnalysesClient.prototype.computeDominatorTree = function (snapshotFilePath) {
  return this._worker.performTask("computeDominatorTree", snapshotFilePath);
};

/**
 * Get the initial, partial view of the dominator tree with the given id.
 *
 * @param {Object} opts
 *        An object specifying options for this request.
 *        - {DominatorTreeId} dominatorTreeId
 *          The id of the dominator tree.
 *        - {Object} breakdown
 *          The breakdown used to generate node labels.
 *        - {Number} maxDepth
 *          The maximum depth to traverse down the tree to create this initial
 *          view.
 *        - {Number} maxSiblings
 *          The maximum number of siblings to visit within each traversed node's
 *          children.
 *
 * @returns {Promise<DominatorTreeNode>}
 */
HeapAnalysesClient.prototype.getDominatorTree = function (opts) {
  return this._worker.performTask("getDominatorTree", opts);
};

/**
 * Get a subset of a nodes children in the dominator tree.
 *
 * @param {Object} opts
 *        An object specifying options for this request.
 *        - {DominatorTreeId} dominatorTreeId
 *          The id of the dominator tree.
 *        - {NodeId} nodeId
 *          The id of the node whose children are being found.
 *        - {Object} breakdown
 *          The breakdown used to generate node labels.
 *        - {Number} startIndex
 *          The starting index within the full set of immediately dominated
 *          children of the children being requested. Children are always sorted
 *          by greatest to least retained size.
 *        - {Number} maxCount
 *          The maximum number of children to return.
 *        - {Number} maxRetainingPaths
 *          The maximum number of retaining paths to find for each node.
 *
 * @returns {Promise<Object>}
 *          A promise of an object with the following properties:
 *          - {Array<DominatorTreeNode>} nodes
 *            The requested nodes that are immediately dominated by the node
 *            identified by `opts.nodeId`.
 *          - {Boolean} moreChildrenAvailable
 *            True iff there are more children available after the returned
 *            nodes.
 *          - {Array<NodeId>} path
 *            The path through the tree from the root to these node's parent, eg
 *            [root's id, child of root's id, child of child of root's id, ..., `nodeId`].
 */
HeapAnalysesClient.prototype.getImmediatelyDominated = function (opts) {
  return this._worker.performTask("getImmediatelyDominated", opts);
};
