/**
 * Formats status strings by replacing underscores with spaces,
 * converting to lowercase, and capitalizing only the first letter.
 * 
 * @param {string} status - The status string to format (e.g., "PENDING_LAUNCH")
 * @returns {string} - Formatted status (e.g., "Pending launch")
 * 
 * @example
 * formatStatus("PENDING_LAUNCH") // returns "Pending launch"
 * formatStatus("PUBLISHED") // returns "Published"
 * formatStatus("") // returns "-"
 * formatStatus(null) // returns "-"
 */
export const formatStatus = (status) => {
    if (!status) return '-';
    return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

export default formatStatus;
